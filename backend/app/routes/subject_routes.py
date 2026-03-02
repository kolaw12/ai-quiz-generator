from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import SubjectListResponse, SubjectInfo
from app.services.vector_store import SubjectVectorStore
import logging

logger = logging.getLogger("SubjectRoutes")

# Router setup
router = APIRouter(prefix="/api/subjects", tags=["Subjects"])

# Instantiate subject vector store service to query live statistics
vector_store = SubjectVectorStore()

# Static metadata mapping extending dynamic Chroma DB states
SUBJECT_METADATA = {
    "biology": {"name": "Biology", "icon": "🧬", "color": "from-green-500 to-emerald-600", "description": "Cell biology, ecology, genetics and evolution."},
    "physics": {"name": "Physics", "icon": "📐", "color": "from-blue-500 to-indigo-600", "description": "Mechanics, waves, electricity, and magnetism."},
    "chemistry": {"name": "Chemistry", "icon": "⚗️", "color": "from-purple-500 to-primary-600", "description": "Atomic structure, bonding, states of matter."},
    "mathematics": {"name": "Mathematics", "icon": "🧮", "color": "from-cyan-500 to-blue-600", "description": "Calculus, algebra, probability, and geometry."},
    "english": {"name": "English Language", "icon": "📝", "color": "from-orange-500 to-red-600", "description": "Lexis, structure, and oral english."},
    "economics": {"name": "Economics", "icon": "📈", "color": "from-amber-500 to-yellow-600", "description": "Micro and macro economic theories."},
}

@router.get("/", response_model=SubjectListResponse)
async def get_subjects():
    """
    Renders available subjects dynamically.
    Polls ChromaDB via SubjectVectorStore to verify actual question counts.
    """
    try:
        # Array of dictionaries like [{"subject": "biology", "count": 115, "loaded": True}, ...]
        stats_list = vector_store.get_subject_stats()
        
        # Build dictionary for immediate O(1) lookups
        stats_dict = {}
        for s in stats_list:
            stats_dict[s["subject"]] = s["count"]
            
        response_data = []
        
        for key, meta in SUBJECT_METADATA.items():
            count = stats_dict.get(key, 0)
            is_available = count > 0
            
            response_data.append(SubjectInfo(
                id=key,
                name=meta["name"],
                icon=meta["icon"],
                color=meta["color"],
                description=meta["description"],
                total_questions=count,
                is_available=is_available
            ))
            
        return SubjectListResponse(subjects=response_data)
        
    except Exception as e:
        logger.error(f"Error serving subject listing: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve subjects.")
