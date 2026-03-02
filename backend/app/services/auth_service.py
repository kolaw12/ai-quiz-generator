import os
import re
import bcrypt
import jwt
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.db_models import User, LoginAttempt, TokenBlacklist
from fastapi import HTTPException, status

# Load from environment in production
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jamb_super_secret_key_42_dont_use_in_prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours locally for convenience

MAX_FAILED_LOGIN_ATTEMPTS = 5
LOCKOUT_MINUTES = 15
MAX_SIGNUP_ATTEMPTS_PER_HOUR = 5

class AuthService:
    """
    Handles secure user registration, hashing, JWT token issuance, and heavy security measures
    like brute force and rate limiting protection.
    """

    @staticmethod
    def _validate_email(email: str) -> bool:
        """Validates standard email format."""
        email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(email_regex, email) or len(email) > 100:
            return False
        return True

    @staticmethod
    def _validate_password(password: str) -> None:
        """Validates password strength criteria. Raises Exception if fails."""
        if not password:
            raise ValueError("Password is required")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(char.isupper() for char in password):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(char.isdigit() for char in password):
            raise ValueError("Password must contain at least one number")
        if not any(not char.isalnum() for char in password):
            raise ValueError("Password must contain at least one special character (!@#$%^&*)")

    @staticmethod
    def _hash_password(password: str) -> str:
        """Hashes an incoming plain text password using bcrypt."""
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
        return hashed_password.decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verifies plain password against hashed DB version."""
        password_byte_enc = plain_password.encode('utf-8')
        hashed_password_byte_enc = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_byte_enc, hashed_password_byte_enc)

    @staticmethod
    def _generate_token(user_id: str, email: str, name: str, role: str) -> str:
        """Generates a secure JWT token containing the user's encoded ID and JTI."""
        import uuid
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        jti = str(uuid.uuid4())
        
        to_encode = {
            "sub": user_id,
            "email": email,
            "name": name,
            "role": role,
            "iat": datetime.utcnow(),
            "exp": expire,
            "jti": jti
        }
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def _check_signup_rate_limit(db: Session, ip_address: str) -> None:
        """Prevents abuse of the signup endpoint."""
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        count = db.query(LoginAttempt).filter(
            LoginAttempt.ip_address == ip_address,
            LoginAttempt.attempt_time >= one_hour_ago,
            LoginAttempt.successful == False, # We log signups as login attempts basically for IP tracking
            LoginAttempt.email == "SIGNUP_ATTEMPT"
        ).count()
        if count >= MAX_SIGNUP_ATTEMPTS_PER_HOUR:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many attempts. Please wait 1 hour."
            )

    @staticmethod
    def _record_signup_attempt(db: Session, ip_address: str):
        attempt = LoginAttempt(
            email="SIGNUP_ATTEMPT",
            ip_address=ip_address,
            successful=False
        )
        db.add(attempt)
        db.commit()

    @staticmethod
    def signup(db: Session, name: str, email: str, password: str, ip_address: str) -> Tuple[User, str]:
        """Complete signup flow with strict validation and token generation."""
        AuthService._check_signup_rate_limit(db, ip_address)
        
        try:
            name = name.strip()
            if not name:
                raise ValueError("Name is required")
            if len(name) < 2:
                raise ValueError("Name must be at least 2 characters")
            if len(name) > 50:
                raise ValueError("Name must be under 50 characters")
                
            email = email.lower().strip()
            if not email:
                raise ValueError("Email is required")
            if not AuthService._validate_email(email):
                raise ValueError("Please enter a valid email")

            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                raise ValueError("This email is already registered. Try logging in instead.")

            AuthService._validate_password(password)

            hashed_pw = AuthService._hash_password(password)
            db_user = User(
                name=name,
                email=email,
                password_hash=hashed_pw,
                xp=0,
                level=1,
                streak=0,
                role="student"
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
            token = AuthService._generate_token(
                user_id=db_user.id,
                email=db_user.email,
                name=db_user.name,
                role=db_user.role
            )
            return db_user, token

        except ValueError as e:
            AuthService._record_signup_attempt(db, ip_address)
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail="Something went wrong. Please try again later.")
            
    @staticmethod
    def _is_account_locked(db: Session, email: str) -> bool:
        lockout_time = datetime.utcnow() - timedelta(minutes=LOCKOUT_MINUTES)
        failed_attempts = db.query(LoginAttempt).filter(
            LoginAttempt.email == email,
            LoginAttempt.successful == False,
            LoginAttempt.attempt_time >= lockout_time
        ).order_by(LoginAttempt.attempt_time.desc()).limit(MAX_FAILED_LOGIN_ATTEMPTS).all()
        
        if len(failed_attempts) >= MAX_FAILED_LOGIN_ATTEMPTS:
            # Check if there's been any successful login since the first of these failed attempts
            if failed_attempts:
                oldest_fail_in_window = failed_attempts[-1].attempt_time
                recent_success = db.query(LoginAttempt).filter(
                    LoginAttempt.email == email,
                    LoginAttempt.successful == True,
                    LoginAttempt.attempt_time >= oldest_fail_in_window
                ).first()
                if not recent_success:
                    return True
        return False

    @staticmethod
    def _record_login_attempt(db: Session, email: str, ip_address: str, successful: bool):
        attempt = LoginAttempt(
            email=email,
            ip_address=ip_address,
            successful=successful
        )
        db.add(attempt)
        db.commit()

    @staticmethod
    def login(db: Session, email: str, password: str, ip_address: str) -> Tuple[User, str]:
        """Handles brute-force mitigation, IP rate-limits, and login verifications."""
        if not email or not email.strip():
            raise HTTPException(status_code=400, detail="Email is required")
        if not password:
            raise HTTPException(status_code=400, detail="Password is required")
        
        email = email.lower().strip()
        
        if AuthService._is_account_locked(db, email):
            raise HTTPException(
                status_code=429, 
                detail="Account temporarily locked due to too many failed attempts. Try again in 15 minutes."
            )
            
        user = db.query(User).filter(User.email == email).first()
        
        # Timing attack mitigation: always hash something even if user doesn't exist to balance response times
        is_valid_password = False
        if user:
            is_valid_password = AuthService.verify_password(password, user.password_hash)
        else:
            AuthService.verify_password("dummy_password_for_timing", "$2b$12$L/X.P3vQZ7x4tZ.kQh3z0eN.1D2V.1f8D5kO2R3m/xZ4gU.kZ.YyC")
            
        if not user or not is_valid_password:
            # Implement progressive delay based on failures
            recent_fails = db.query(LoginAttempt).filter(
                LoginAttempt.email == email,
                LoginAttempt.successful == False,
                LoginAttempt.attempt_time >= datetime.utcnow() - timedelta(minutes=15)
            ).count()
            
            if recent_fails == 1:
                time.sleep(1)
            elif recent_fails == 2:
                time.sleep(2)
            elif recent_fails >= 3:
                time.sleep(5)
                
            AuthService._record_login_attempt(db, email, ip_address, False)
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"}
            )
            
        AuthService._record_login_attempt(db, email, ip_address, True)
        # Update last active
        user.last_active = datetime.utcnow()
        db.commit()
        
        token = AuthService._generate_token(
            user_id=user.id,
            email=user.email,
            name=user.name,
            role=user.role
        )
        return user, token

    @staticmethod
    def logout(db: Session, token: str) -> None:
        """Blacklists the given JWT token assuming it is valid."""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            jti = payload.get("jti")
            exp = payload.get("exp")
            if jti and exp:
                blacklist_entry = TokenBlacklist(
                    jti=jti,
                    expires_at=datetime.utcfromtimestamp(exp)
                )
                db.add(blacklist_entry)
                db.commit()
        except jwt.PyJWTError:
            pass # Invalid tokens are ignored on logout
