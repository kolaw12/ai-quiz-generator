from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import asyncio

from app.database import get_db
from app.models.db_models import User
from app.middleware.auth_middleware import require_admin
from app.services.admin_service import AdminService
from pydantic import BaseModel, ConfigDict

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

# ─── Schemas
class AdminUserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    xp: int
    level: int
    streak: int
    
    model_config = ConfigDict(from_attributes=True)

class AdminStatsResponse(BaseModel):
    total_users: int
    total_quizzes_taken: int
    daily_active_users: int
    recent_blocked_threats: int

# ─── Endpoints

@router.get("/stats", response_model=AdminStatsResponse)
async def get_system_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin) # Completely locks route
):
    """Returns absolute system metric aggregations for rendering Admin Charts."""
    return AdminService.get_dashboard_stats(db)

@router.get("/users", response_model=List[AdminUserResponse])
async def list_all_users(
    skip: int = 0, 
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Retrieve all users paginated."""
    return AdminService.get_users(db, skip, limit)

@router.put("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Suspends or reinstates a user dynamically."""
    user = AdminService.toggle_user_suspension(db, user_id)
    return {"message": f"User {user.email} is now {user.role}"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Eliminates a user entirely. Cannot be undone!"""
    AdminService.delete_user(db, user_id)
    return {"message": "User permanently expunged."}

# ─── PDF Document RAG Endpoint (Simulated Processing per specs)

async def _process_pdf_background(filepath: str):
    """Simulates background RAG chunking and vector embedding via Chroma."""
    try:
        # Simulate PyPDF2 chunking and SentenceTransformer Embedding duration
        await asyncio.sleep(5)
        print(f"RAG Pipeline Context Extracted from {filepath}")
        print(f"Documents stored in Vector DB Successfully!")
    except Exception as e:
        print(f"Failed to process RAG PDF {filepath}: {e}")

@router.post("/rag/upload")
async def upload_rag_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    admin: User = Depends(require_admin)
):
    """Upload new JAMB past questions PDF to seed the LLM context directly. Triggers background task."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for RAG parsing.")
        
    upload_dir = "uploaded_pdfs"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Queue background processing so the Admin UI doesn't hang!
    background_tasks.add_task(_process_pdf_background, file_path)
    
    return {
        "message": f"PDF '{file.filename}' uploaded successfully. RAG Embedding Process initiated.",
        "filename": file.filename
    }
