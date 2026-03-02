import os
import sys
import argparse
from pathlib import Path

# Add the parent directory to sys.path so we can import 'app' module
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.services.pdf_processor import PDFProcessor
from app.services.vector_store import VectorStoreService

PDF_DIR = os.path.join(str(Path(__file__).resolve().parent.parent.parent), "pdfs")

def load_subjects(target_subject=None):
    """
    Scans the pdfs/ directory for Subject PDFs, parses them via PDFProcessor,
    and loads the validated questions into separate ChromaDB collections.
    """
    print("")
    print("=" * 50)
    print("  JAMB SUBJECT LOADING REPORT")
    print("=" * 50)
    print("")

    if not os.path.exists(PDF_DIR):
        print(f"ERROR: '{PDF_DIR}' directory not found. Please create it and add your PDFs.")
        return

    # Find all PDFs in the directory
    pdf_files = [f for f in os.listdir(PDF_DIR) if f.endswith('.pdf')]
    
    if not pdf_files:
        print(f"ERROR: No PDFs found in the '{PDF_DIR}' directory.")
        return

    vector_store = VectorStoreService()
    grand_total_ready = 0
    subjects_loaded = 0

    for filename in sorted(pdf_files):
        # Extract subject from filename (e.g., "biology.pdf" -> "biology")
        subject = filename.replace('.pdf', '').strip().lower()

        # If a specific subject is requested via CLI flags, skip others
        if target_subject and subject != target_subject.lower():
            continue

        pdf_path = os.path.join(PDF_DIR, filename)
        
        print(f"--- {subject.upper()} ({filename}) ---")
        
        try:
            # 1. Instantiate the smart PDF processor for this specific subject
            processor = PDFProcessor(subject)
            
            # 2. Extract and parse data
            result = processor.process_pdf(pdf_path)
            questions = result["questions"]
            report = result["report"]

            print(f"   Pages scanned: {report['total_pages']}")
            print(f"   Questions found: {report['questions_found']}")
            print(f"   Questions parsed: {report['questions_parsed']}")
            print(f"   Questions failed: {report['questions_failed']}")

            # 3. Store valid questions in ChromaDB Vector Store
            if questions:
                # Delete existing collection to prevent duplicates if re-running
                try:
                    vector_store.client.delete_collection(f"jamb_{subject}")
                except Exception:
                    pass  # Collection might not exist yet

                # Add freshly parsed questions to the VectorDB
                vector_store.add_questions(subject, questions)
                print(f"   ChromaDB status: LOADED")
                grand_total_ready += len(questions)
                subjects_loaded += 1
            else:
                print(f"   ChromaDB status: SKIPPED (no valid questions)")
                
        except Exception as e:
            print(f"   ERROR: {str(e)}")
        print("")

    print("=" * 50)
    print(f"  TOTAL: {grand_total_ready} questions loaded across {subjects_loaded} subjects")
    print("=" * 50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Load JAMB Past Questions PDFs into Vector Store.")
    parser.add_argument("--subject", type=str, help="Specify a single subject to load (e.g., 'biology').")
    args = parser.parse_args()
    
    load_subjects(args.subject)
