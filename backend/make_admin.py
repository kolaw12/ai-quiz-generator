import argparse
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.db_models import User

def elevate_user_to_admin(email: str):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User with email '{email}' not found.")
            return
            
        if user.role == "admin":
            print(f"✅ User '{email}' is already an admin.")
            return
            
        user.role = "admin"
        db.commit()
        print(f"🚀 Success! User '{user.name}' ({email}) is now a System Administrator.")
    except Exception as e:
        print(f"⚠️ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Elevate a user to System Administrator.")
    parser.add_argument("email", type=str, help="The registered email address of the user.")
    args = parser.parse_args()
    
    elevate_user_to_admin(args.email)
