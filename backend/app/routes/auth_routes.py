from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional

from app.database import get_db
from app.services.auth_service import AuthService
from app.models.db_models import User
from app.middleware.auth_middleware import get_current_user
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

# --- Pydantic Schemas strictly for Auth Endpoints --- 
class UserSignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)

class UserResponseModel(BaseModel):
    id: str
    name: str
    email: str
    xp: int
    level: int
    streak: int
    role: str
    
    model_config = ConfigDict(from_attributes=True)

class AuthTokenResponse(BaseModel):
    user: UserResponseModel
    token: str

@router.post("/signup", response_model=AuthTokenResponse)
async def signup(user_data: UserSignupRequest, request: Request, db: Session = Depends(get_db)):
    """Registers a new user, hashes the password, and returns a JWT."""
    # Assuming standard real-world reverse proxy setup (Nginx/Cloudflare)
    # to capture forward IP or use direct.
    ip_address = request.headers.get("x-forwarded-for", request.client.host)
    if "," in ip_address:
        ip_address = ip_address.split(",")[0]
        
    db_user, access_token = AuthService.signup(
        db=db,
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        ip_address=ip_address
    )
    
    return AuthTokenResponse(
        user=UserResponseModel.model_validate(db_user),
        token=access_token
    )

@router.post("/login", response_model=AuthTokenResponse)
async def login(credentials: UserLoginRequest, request: Request, db: Session = Depends(get_db)):
    """Authenticates the user and returns a JWT token."""
    ip_address = request.headers.get("x-forwarded-for", request.client.host)
    if "," in ip_address:
        ip_address = ip_address.split(",")[0]

    db_user, access_token = AuthService.login(
        db=db,
        email=credentials.email,
        password=credentials.password,
        ip_address=ip_address
    )
    
    return AuthTokenResponse(
        user=UserResponseModel.model_validate(db_user), 
        token=access_token
    )

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently logged in User's profile information.
    Protected strictly by our JWT middleware lock.
    """
    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "xp": current_user.xp,
            "level": current_user.level,
            "streak": current_user.streak,
            "role": current_user.role
        }
    }

@router.put("/me")
async def update_me(update_data: UserUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Updates the currently logged in User's profile information.
    """
    if update_data.name:
        current_user.name = update_data.name.strip()
        db.commit()
        db.refresh(current_user)
        
    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "xp": current_user.xp,
            "level": current_user.level,
            "streak": current_user.streak,
            "role": current_user.role
        }
    }

@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Logout invalidates the existing token on the server side via the blacklist."""
    token = credentials.credentials
    AuthService.logout(db, token)
    return {"message": "Logged out successfully"}
