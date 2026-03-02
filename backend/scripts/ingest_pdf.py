import os
import sys
# Add backend to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
from app.core.config import settings

def ingest_document(pdf_path: str):
    """
    Decoupled script to process PDFs, chunk them intelligently, 
    and store embeddings in ChromaDB persistent storage.
    """
    print(f"🚀 Starting Ingestion for: {pdf_path}")
    
    if not os.path.exists(pdf_path):
        print(f"❌ Error: File not found at {pdf_path}")
        return

    # STEP 1: Load PDF Context (Replacing strict Regex parsing)
    # This reads the PDF and splits it into pages safely
    print("📄 Loading PDF...")
    loader = PyPDFLoader(pdf_path)
    pages = loader.load()
    print(f"✅ Loaded {len(pages)} pages.")

    # STEP 2: Intelligent Chunking
    # We use RecursiveCharacterTextSplitter. It tries to split on paragraphs first,
    # keeping concepts (like a full question/answer block) together.
    print("✂️ Chunking text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(pages)
    print(f"✅ Created {len(chunks)} chunks.")

    # STEP 3: Setup ChromaDB
    print("💾 Connecting to Vector DB...")
    # Using persistent client so it survives restarts!
    chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)
    
    # Get or Create Collection
    collection = chroma_client.get_or_create_collection(name=settings.COLLECTION_NAME)

    # STEP 4: Create Embeddings & Store
    print("🧮 Generating Embeddings and Storing Data...")
    embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
    
    # Process in batches to avoid memory overload for huge PDFs
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        
        texts = [doc.page_content for doc in batch]
        metadatas = [{"source": doc.metadata.get('source', pdf_path), "page": doc.metadata.get('page', 0)} for doc in batch]
        ids = [f"chunk_{i+j}" for j in range(len(batch))]
        
        # Generate embeddings locally
        embeddings = embedding_model.encode(texts).tolist()
        
        # Add to Chroma
        collection.add(
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        print(f"  -> Processed batch {i//batch_size + 1} (Chunks {i} to {i+len(batch)})")

    print("\n🎉 Ingestion Complete! Your DB is ready for the API.")

if __name__ == "__main__":
    # Example usage: python scripts/ingest_pdf.py ../pdfs/biology.pdf
    # You run this ONCE per document. The FastApi server doesn't run this.
    target_pdf = input("Enter path to PDF (e.g., ../pdfs/biology.pdf): ")
    ingest_document(target_pdf)
