from sentence_transformers import SentenceTransformer
import chromadb
from app.core.config import settings

# Load model globally during server start
print("Loading Embedding Model...")
embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)

# Connect to DB locally (Assuming ingestion script has run)
print("Connecting to Vector DB...")
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)

try:
    collection = chroma_client.get_collection(name=settings.COLLECTION_NAME)
except ValueError:
    print(f"⚠️ Warning: Collection '{settings.COLLECTION_NAME}' not found! Run ingestion first.")
    collection = None

def get_context_for_topic(topic: str, max_chunks: int = 5) -> str:
    """
    Search ChromaDB for chunks semantically matching the user's requested topic.
    Returns merged string context.
    """
    if not collection:
        return ""
        
    query_embedding = embedding_model.encode([topic]).tolist()
    
    # Hybrid search / standard vector search
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=max_chunks
    )
    
    if not results['documents'] or len(results['documents'][0]) == 0:
        return "No strictly relevant context found."
        
    # Merge relevant chunks into a giant string for the LLM prompt
    documents = results['documents'][0]
    merged_context = "\n\n---CHUNK---\n\n".join(documents)
    
    return merged_context
