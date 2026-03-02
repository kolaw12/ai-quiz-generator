import json
import logging
from groq import AsyncGroq
from tenacity import retry, stop_after_attempt, wait_exponential
from app.core.config import settings
from app.models.schemas import QuizRequest, QuizResponse, EvaluateRequest, EvaluateResponse

logger = logging.getLogger(__name__)

# Async Client for non-blocking server performance
groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
async def generate_quiz_from_context(request: QuizRequest, context: str) -> QuizResponse:
    """
    Given a topic and context chunks from the vector DB, this forces Groq
    to generate a valid JSON array of questions using strict system prompting.
    Will retry up to 3 times on failure.
    """
    
    system_prompt = f"""You are a strict, expert Biology teacher generating highly accurate, multiple-choice JAMB-style questions.
You MUST ONLY format your response as valid JSON matching the exact schema provided.
DO NOT wrap the JSON in markdown blocks (e.g., ```json). Return raw JSON only.

SCHEMA REQUIREMENTS:
{{
  "quiz_title": "string",
  "total_questions": {request.num_questions},
  "difficulty": "medium",
  "questions": [
    {{
      "id": 1,
      "type": "multiple_choice",
      "question": "string",
      "options": {{"A": "text", "B": "text", "C": "text", "D": "text"}},
      "correct_answer": "A",
      "explanation": "Brief reasoning.",
      "source_chunk": "Snippet from the provided text proving the answer"
    }}
  ]
}}

RULES:
1. ONLY utilize the context provided below. DO NOT invent facts outside the context.
2. Formulate exactly {request.num_questions} questions.
3. Every question must have exactly 4 options (A, B, C, D).
4. The correct_answer must be exactly "A", "B", "C", or "D".
"""

    user_prompt = f"""TOPIC REQUSTED: {request.topic}

SOURCE CONTEXT FROM TEXTBOOK (Use ONLY this to build questions):
{context}

Generate the JSON quiz now."""

    try:
        response = await groq_client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3, # low temp for JSON stability
            max_tokens=4000,
            response_format={"type": "json_object"} # Forces JSON output structurally on supported models
        )
        
        raw_content = response.choices[0].message.content
        
        data = json.loads(raw_content)
        return QuizResponse(**data)
    except json.JSONDecodeError as e:
        logger.error(f"LLM failed to return valid JSON: {str(e)}\nRaw: {raw_content}")
        raise ValueError(f"LLM failed to return valid JSON: {str(e)}")
    except Exception as e:
        logger.error(f"Error calling Groq API for quiz generation: {str(e)}")
        raise

@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=1, max=5), reraise=True)
async def evaluate_answer(request: EvaluateRequest) -> EvaluateResponse:
    """
    Provides an instant, detailed explanation comparing the user's choice to the actual answer.
    Will retry 2 times on occasional network failure.
    """
    system_prompt = """You are a friendly JAMB science teacher talking to a Nigerian secondary school student (age 15-18).

RULES FOR YOUR EXPLANATIONS:
1. Use SIMPLE English — like you're talking to your younger sibling.
2. Maximum 2-3 short sentences per explanation.
3. Use everyday examples and analogies they can relate to.
    - "Think of it like charging your phone..."
    - "It's like when you cook rice..."
4. Use emojis to make it visual and fun.
5. Break down big scientific words:
    - "Photosynthesis (Photo = light, Synthesis = making)"
6. Give a memory trick when possible:
    - "Remember: MR NIGER D (for characteristics of living things)"
7. NEVER use these words:
    - "whereby", "utilize", "subsequently", "aforementioned"
    - "elucidate", "paradigm", "methodology", "facilitate"
8. If the student got it wrong, be kind: "Don't worry! This is a common mistake because..."

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

CORRECT: [Simple explanation of why the right answer is right, max 2 sentences, with an analogy]

WRONG_A: [Why A is wrong, 1 sentence]
WRONG_B: [Why B is wrong, 1 sentence]  
WRONG_C: [Why C is wrong, 1 sentence]
WRONG_D: [Why D is wrong, 1 sentence]

TIP: [Memory trick or easy way to remember, 1 sentence]
"""
    
    status = "Correct" if request.selected_option == request.correct_option else "Incorrect"
    
    user_prompt = f"""Question: {request.question_text}
Student selected: Option {request.selected_option}.
Correct answer is: Option {request.correct_option}.

This student was {status}."""
    
    try:
        response = await groq_client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=250 # Increased slightly for formatting overhead
        )
        
        explanation = response.choices[0].message.content.strip()
        
        return EvaluateResponse(
            is_correct=(request.selected_option == request.correct_option),
            correct_answer=request.correct_option,
            explanation=explanation
        )
    except Exception as e:
        logger.error(f"Error calling Groq API for answer evaluation: {str(e)}")
        raise
