from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.db_models import User, QuizHistory, LoginAttempt
from fastapi import HTTPException, status
from typing import Dict, Any, List

class AdminService:
    @staticmethod
    def get_dashboard_stats(db: Session) -> Dict[str, Any]:
        """Aggregate global application statistics for Admin Dashboards."""
        total_users = db.query(User).count()
        total_quizzes = db.query(QuizHistory).count()
        
        # Calculate Daily Active Users (DAU)
        one_day_ago = datetime.utcnow() - timedelta(days=1)
        dau = db.query(User).filter(User.last_active >= one_day_ago).count()
        
        # Calculate recent login attempts and blocks
        recent_failed_logins = db.query(LoginAttempt).filter(
            LoginAttempt.successful == False,
            LoginAttempt.attempt_time >= one_day_ago
        ).count()
        
        return {
            "total_users": total_users,
            "total_quizzes_taken": total_quizzes,
            "daily_active_users": dau,
            "recent_blocked_threats": recent_failed_logins
        }

    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 50) -> List[User]:
        """Retrieve paginated list of all users."""
        return db.query(User).order_by(User.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def toggle_user_suspension(db: Session, user_id: str) -> User:
        """Suspend a user by flipping their role, or reinstate them."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user.role == "admin":
            raise HTTPException(status_code=403, detail="Cannot suspend an administrator")
            
        if user.role == "student":
            user.role = "suspended"
        elif user.role == "suspended":
            user.role = "student"
            
        db.commit()
        db.refresh(user)
        return user
        
    @staticmethod
    def delete_user(db: Session, user_id: str) -> None:
        """Permanently delete a user from the system."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if user.role == "admin":
            raise HTTPException(status_code=403, detail="Cannot delete an administrator")
            
        db.delete(user)
        db.commit()
