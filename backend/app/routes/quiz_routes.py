from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.models.schemas import QuizSetupRequest, QuizSetupResponse, AnswerRequest, AnswerResponse, ExplainResponse
from app.services.vector_store import SubjectVectorStore
from app.services.quiz_service import QuizService
from app.database import get_db
from app.models.db_models import User
from app.middleware.auth_middleware import get_current_user
import logging

logger = logging.getLogger("QuizRoutes")
router = APIRouter(prefix="/api/quiz", tags=["Quiz Configuration"])

vector_store = SubjectVectorStore()
quiz_service = QuizService(vector_store)

@router.post("/start", response_model=QuizSetupResponse)
async def start_quiz(
    request: QuizSetupRequest, 
    current_user: User = Depends(get_current_user)
):
    try:
        if not request.subject:
            raise ValueError("Subject must be provided to start a quiz.")
            
        session_info = quiz_service.create_session(
            user_id=current_user.id,
            subject=request.subject.lower(),
            num_questions=request.req_count,
            topic=request.topic
        )
        return QuizSetupResponse(
            sessionId=session_info["session_id"],
            subject=session_info["subject"],
            total_questions=session_info["total_questions"],
            firstQuestion=session_info["first_question"]
        )
    except ValueError as val_e:
        # Expected business logic failures, e.g., NO QUESTIONS FOUND
        raise HTTPException(status_code=400, detail=str(val_e))
    except Exception as e:
        logger.error(f"Error starting quiz: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while building quiz.")

@router.get("/{session_id}")
async def get_quiz_question(
    session_id: str, 
    question_id: int, 
    current_user: User = Depends(get_current_user)
):
    try:
        q = quiz_service.get_question(current_user.id, session_id, question_id)
        return q
    except ValueError as val_e:
        raise HTTPException(status_code=400, detail=str(val_e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{session_id}/answer", response_model=AnswerResponse)
async def submit_answer(
    session_id: str, 
    request: AnswerRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = quiz_service.evaluate_answer(
            user_id=current_user.id,
            session_id=session_id,
            question_id=str(request.questionId),
            selected_option=request.selectedOption,
            db=db
        )
        return AnswerResponse(correct=result["correct"], xpEarned=result["xpEarned"])
    except ValueError as val_e:
         raise HTTPException(status_code=400, detail=str(val_e))
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

@router.get("/{session_id}/explain", response_model=ExplainResponse)
async def explain_answer(
    session_id: str, 
    question_id: str, 
    current_user: User = Depends(get_current_user)
):
    try:
        explanation = await quiz_service.explain_answer(current_user.id, session_id, str(question_id))
        return ExplainResponse(explanation=explanation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{session_id}/results")
async def get_quiz_results(
    session_id: str, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return quiz_service.get_results(current_user.id, session_id, db)
    except ValueError as val_e:
         raise HTTPException(status_code=400, detail=str(val_e))
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))
