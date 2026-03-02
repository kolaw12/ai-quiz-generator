from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# --- QUIZ CREATION MODELS ---
class QuizSetupRequest(BaseModel):
    subject: str = Field(..., description="The main subject to query (e.g., 'biology', 'physics')")
    topic: Optional[str] = Field(None, description="Optional specific topic within the subject (e.g., 'cell biology')")
    req_count: int = Field(default=10, ge=1, le=50, description="Number of questions to generate")
    difficulty: Optional[str] = Field("medium", description="Desired difficulty level")
    mode: Optional[str] = Field("practice", description="Validation mode (practice vs timed)")

class QuizSetupResponse(BaseModel):
    sessionId: str
    subject: str
    total_questions: int
    firstQuestion: Dict[str, Any]

# --- ANSWER SUBMISSION MODELS ---
class AnswerRequest(BaseModel):
    questionId: str = Field(..., description="The ID of the question being answered")
    selectedOption: str = Field(..., description="The option the user selected (e.g., 'A', 'B')")

class AnswerResponse(BaseModel):
    correct: bool
    xpEarned: int

# --- EXPLANATION & RESULTS ---
class ExplainResponse(BaseModel):
    explanation: str

# --- SUBJECTS MODELS ---
class SubjectInfo(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    total_questions: int
    description: str
    is_available: bool

class SubjectListResponse(BaseModel):
    subjects: List[SubjectInfo]
