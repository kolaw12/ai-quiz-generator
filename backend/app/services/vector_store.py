import chromadb
import logging
from typing import List, Dict, Any, Optional
import uuid
import random

logger = logging.getLogger("SubjectVectorStore")
logger.setLevel(logging.INFO)

class SubjectVectorStore:
    """
    Manages vector storage of JAMB questions using ChromaDB.
    Creates SEPARATE collections per subject.
    """
    COLLECTION_MAP = {
        'biology': 'jamb_biology',
        'physics': 'jamb_physics',
        'chemistry': 'jamb_chemistry',
        'mathematics': 'jamb_mathematics',
    }
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        """Initialize ChromaDB client"""
        self.persist_directory = persist_directory
        # MUST create persistent client
        self.client = chromadb.PersistentClient(path=self.persist_directory)
        logger.info(f"Initialized ChromaDB at {self.persist_directory}")
    
    def _get_collection_name(self, subject: str) -> str:
        subject = subject.lower().strip()
        return self.COLLECTION_MAP.get(subject, f"jamb_{subject}")

    def load_subject(self, subject: str, questions: list) -> dict:
        """
        Load questions into subject-specific collection.
        1. Get or create collection for this subject
        2. Clear old data if exists
        3. Create embeddings for all questions
        4. Store in collection with metadata
        5. Return stats
        """
        if not questions:
            return {"subject": subject, "loaded": 0, "success": False, "error": "No questions provided"}
            
        subject = subject.lower().strip()
        collection_name = self._get_collection_name(subject)
        
        try:
            # Clear old data if exists
            try:
                self.client.delete_collection(name=collection_name)
                logger.info(f"Deleted old collection {collection_name}")
            except Exception:
                pass # Doesn't exist yet, which is fine
                
            # Create fresh collection for this subject
            collection = self.client.create_collection(name=collection_name)
            
            ids = []
            documents = []
            metadatas = []
            
            for q in questions:
                # Guaranteed unique ID per question
                q_id = str(q.get('id', uuid.uuid4()))
                doc_id = f"{subject}_{q_id}"
                
                # Inject semantic text for embedding (Question + Options)
                doc_text = f"{q.get('question', '')} \n A: {q['options'].get('A','')} \n B: {q['options'].get('B','')} \n C: {q['options'].get('C','')} \n D: {q['options'].get('D','')}"
                
                ids.append(doc_id)
                documents.append(doc_text)
                
                # Store subject metadata explicitly!
                meta = {
                    "subject": subject,
                    "question_id": str(q_id),
                    "page": int(q.get('page', 0)),
                    "correct_answer": str(q.get('correct_answer', 'A')),
                    "option_a": str(q['options'].get("A", "")),
                    "option_b": str(q['options'].get("B", "")),
                    "option_c": str(q['options'].get("C", "")),
                    "option_d": str(q['options'].get("D", ""))
                }
                metadatas.append(meta)
            
            logger.info(f"Upserting {len(documents)} questions into {collection_name}...")
            
            # Embeddings happen automatically via sentence-transformers default inside ChromaDB
            collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            
            count = collection.count()
            logger.info(f"Successfully loaded {count} questions for {subject}.")
            return {"subject": subject, "loaded": count, "success": True}
            
        except Exception as e:
            logger.error(f"Failed to load subject {subject}: {str(e)}")
            return {"subject": subject, "loaded": 0, "success": False, "error": str(e)}

    def get_quiz_questions(self, subject: str, num: int = 10, topic: str = None) -> list:
        """
        Get questions for a quiz.
        MUST query the correct subject collection.
        If topic provided -> semantic search.
        If no topic -> random selection.
        """
        subject = subject.lower().strip()
        collection_name = self._get_collection_name(subject)
        
        try:
            collection = self.client.get_collection(name=collection_name)
        except Exception:
            logger.warning(f"Collection {collection_name} does not exist. Please run loader.")
            return []
            
        count = collection.count()
        if count == 0:
            return []
            
        try:
            if topic and topic.lower() != "all topics" and topic.lower() != "random":
                # Semantic search
                results = collection.query(
                    query_texts=[topic],
                    n_results=min(num * 2, count) # Fetch a few extra and shuffle
                )
            else:
                # Random selection. Query the subject name generally to get a diverse spread
                results = collection.query(
                    query_texts=[f"{subject} concepts and questions"],
                    n_results=min(num * 5, count) # Fetch a wide net
                )
            
            formatted = []
            if results['documents'] and len(results['documents']) > 0:
                docs = results['documents'][0]
                metas = results['metadatas'][0]
                
                for i in range(len(docs)):
                    m = metas[i]
                    formatted.append({
                        "id": m.get("question_id"),
                        "subject": m.get("subject", subject),
                        "type": "multiple_choice",
                        "question": docs[i].split(" \n A:")[0].strip(), # Recover question prompt
                        "options": {
                            "A": m.get("option_a", ""),
                            "B": m.get("option_b", ""),
                            "C": m.get("option_c", ""),
                            "D": m.get("option_d", "")
                        },
                        "correct_answer": m.get("correct_answer", "A")
                    })
            
            random.shuffle(formatted)
            return formatted[:num]
            
        except Exception as e:
            logger.error(f"Error querying {collection_name}: {str(e)}")
            return []
            
    def get_loaded_subjects(self) -> list:
        """
        Return list of subjects that have questions loaded.
        Check each collection for document count > 0.
        """
        loaded = []
        for subject, col_name in self.COLLECTION_MAP.items():
            try:
                col = self.client.get_collection(name=col_name)
                if col.count() > 0:
                    loaded.append(subject)
            except Exception:
                continue
        return loaded
        
    def get_subject_stats(self) -> list:
        """
        Return stats for all subjects:
        """
        stats = []
        for subject, col_name in self.COLLECTION_MAP.items():
            try:
                col = self.client.get_collection(name=col_name)
                count = col.count()
                stats.append({
                    "subject": subject,
                    "count": count,
                    "loaded": count > 0
                })
            except Exception:
                stats.append({
                    "subject": subject,
                    "count": 0,
                    "loaded": False
                })
        return stats
