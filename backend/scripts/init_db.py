import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.database import engine, Base
from app.models import db_models

def init_db():
    print("Initializing SQLite database...")
    
    # Create all tables defined in db_models.py
    Base.metadata.create_all(bind=engine)
    
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "jamb_quiz.db"))
    print(f"Database created successfully at: {db_path}")
    print("Tables created: users, quiz_history, user_answers, bookmarks, achievements")

if __name__ == "__main__":
    init_db()
