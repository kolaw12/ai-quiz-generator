from typing import Optional, Dict, Any, List
import uuid
import datetime
from sqlalchemy.orm import Session
from app.models.db_models import User, QuizHistory, UserAnswer
import logging

logger = logging.getLogger("QuizService")

ACTIVE_SESSIONS = {}

class QuizService:
    def __init__(self, vector_store):
        """Expects an instance of SubjectVectorStore."""
        self.vector_store = vector_store

    def create_session(self, user_id: str, subject: str, num_questions: int, topic: Optional[str] = None) -> Dict[str, Any]:
        """
        Pulls questions from subject-specific ChromaDB collection and initializes an active tracking session.
        Handles missing/zero questions gracefully.
        """
        subject = subject.lower().strip()
        
        # Load questions from the specialized subject store!
        raw_questions = self.vector_store.get_quiz_questions(
            subject=subject,
            num=max(1, int(num_questions)),
            topic=topic
        )
            
        if not raw_questions or len(raw_questions) == 0:
            raise ValueError(f"No questions available for subject: '{subject}'. Please load the database.")

        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        
        ACTIVE_SESSIONS[session_id] = {
            "user_id": user_id,
            "subject": subject,
            "questions": raw_questions,
            "current_index": 0,
            "score": 0,
            "answers": [],
            "start_time": datetime.datetime.utcnow()
        }
        
        return {
            "session_id": session_id,
            "subject": subject,
            "total_questions": len(raw_questions),
            "first_question": self._sanitize_question_for_client(raw_questions[0])
        }

    def get_question(self, user_id: str, session_id: str, index: int) -> Dict[str, Any]:
        session = self._get_session(session_id, user_id)
        
        if index < 0 or index >= len(session["questions"]):
            raise ValueError("Question index out of bounds.")
            
        q = session["questions"][index]
        session["current_index"] = index
        return self._sanitize_question_for_client(q)

    def evaluate_answer(self, user_id: str, session_id: str, question_id: str, selected_option: str, db: Session) -> Dict[str, Any]:
        session = self._get_session(session_id, user_id)
        
        target_question = None
        for q in session["questions"]:
            if str(q["id"]) == str(question_id):
                target_question = q
                break
                
        if not target_question:
            raise ValueError("Invalid question ID.")
            
        is_correct = (selected_option.upper() == target_question["correct_answer"].upper())
        
        xp_earned = 10 if is_correct else 0
        
        session["answers"].append({
            "question_number": str(question_id), # Ensure string mapping from UUIDs
            "question_text": target_question["question"],
            "is_correct": is_correct,
            "selected_option": selected_option.upper(),
            "correct_option": target_question["correct_answer"].upper()
        })
        
        if is_correct:
            session["score"] += 1
            
        return {
            "correct": is_correct,
            "xpEarned": xp_earned,
            "correct_answer": target_question["correct_answer"]
        }

    async def explain_answer(self, user_id: str, session_id: str, question_id: str) -> str:
        session = self._get_session(session_id, user_id)
        
        target_question = None
        for q in session["questions"]:
            if str(q["id"]) == str(question_id):
                target_question = q
                break
                
        if not target_question:
            raise ValueError("Invalid question ID.")
            
        subject = session["subject"]
        topic_query = target_question["question"]
        context_docs = []
        
        try:
            # Generate mini topic search against this subject's store
            context_docs = self.vector_store.get_quiz_questions(subject=subject, num=2, topic=topic_query)
            context_str = "\n".join([doc['question'] for doc in context_docs])
            
            from app.services.llm_service import groq_client
            from app.core.config import settings
            
            system_prompt = "You are a helpful JAMB exam tutor. Provide a very brief 2-3 sentence explanation."
            correct_letter = target_question["correct_answer"]
            correct_text = target_question["options"].get(correct_letter, "")
            
            user_prompt = f"""Question: {target_question["question"]}
Correct answer is: Option {correct_letter} ({correct_text}).

TEXTBOOK CONTEXT:
{context_str}

Use the textbook context to specifically explain logically why option {correct_letter} is correct. Keep it under 3 sentences."""

            response = await groq_client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            explanation = response.choices[0].message.content.strip()
            return f"🤖 AI Tutor: {explanation}"
            
        except Exception as e:
            logger.error(f"LLM explanation error: {e}")
            if context_docs and len(context_docs) > 0:
                snippet = context_docs[0]['question']
                if len(snippet) > 200: snippet = snippet[:200] + "..."
                return f"💡 Source Material: {snippet}"
            
            return f"The correct answer is Option {target_question['correct_answer']}."

    def get_results(self, user_id: str, session_id: str, db: Session) -> Dict[str, Any]:
        """Returns the finalized score, saves to DB QuizHistory, updates user XP."""
        session = self._get_session(session_id, user_id)
        
        total_q = len(session["questions"])
        score = session["score"]
        percentage = (score / total_q) * 100 if total_q > 0 else 0
        xp_total = score * 10
        
        time_taken = (datetime.datetime.utcnow() - session["start_time"]).total_seconds()
        
        # Save QuizHistory
        history = QuizHistory(
            user_id=user_id,
            subject=session["subject"],
            score=score,
            total_questions=total_q,
            percentage=percentage,
            xp_earned=xp_total,
            time_taken=int(time_taken)
        )
        db.add(history)
        db.commit()
        db.refresh(history)

        # Save all User Answers
        for idx, ans in enumerate(session["answers"]):
            db_answer = UserAnswer(
                quiz_history_id=history.id,
                question_number=idx + 1, # Storing sequential integer vs huge UUID
                question_text=ans["question_text"],
                selected_option=ans["selected_option"],
                correct_option=ans["correct_option"],
                is_correct=ans["is_correct"]
            )
            db.add(db_answer)
            
        # Update User XP & Streak
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.xp += xp_total
            user.level = (user.xp // 100) + 1 # every 100 XP is a level up
            
            last_date = user.last_active.date() if user.last_active else None
            today = datetime.datetime.utcnow().date()
            if last_date:
                delta = (today - last_date).days
                if delta == 1:
                    user.streak += 1
                elif delta > 1:
                    user.streak = 1
            else:
                user.streak = 1
                
            user.last_active = datetime.datetime.utcnow()
        db.commit()

        results = {
            "score": score,
            "total": total_q,
            "breakdown": session["answers"],
            "xp_earned": xp_total
        }
        
        ACTIVE_SESSIONS.pop(session_id, None)
        return results

    def _get_session(self, session_id: str, user_id: str):
        if session_id not in ACTIVE_SESSIONS:
            raise ValueError("Quiz session expired or invalid.")
        session = ACTIVE_SESSIONS[session_id]
        if session["user_id"] != user_id:
            raise ValueError("Unauthorized. Session belongs to another user.")
        return session

    def _sanitize_question_for_client(self, question: Dict[str, Any]) -> Dict[str, Any]:
        sanitized = dict(question)
        if "correct_answer" in sanitized:
            del sanitized["correct_answer"]
        return sanitized
