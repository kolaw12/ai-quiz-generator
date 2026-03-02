import sqlite3
import os

try:
    conn = sqlite3.connect('jamb_quiz.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'student' NOT NULL;")
    conn.commit()
    print("Migration successful")
    conn.close()
except sqlite3.OperationalError as e:
    print(f"Migration error or already exists: {e}")
