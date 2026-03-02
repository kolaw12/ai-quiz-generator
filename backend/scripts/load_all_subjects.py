"""
JAMB Subject Loader
===================
Run this to load ALL subject PDFs into ChromaDB.
"""
import sys
import os
import argparse
import time

# Add parent directory to path so we can import services
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pdf_processor import UniversalPDFProcessor
from app.services.vector_store import SubjectVectorStore

def print_header(text: str):
    print(f"\n═══════════════════════════════════════")
    print(f"📚 {text}")
    print(f"═══════════════════════════════════════")

def load_subjects(target_subject=None, check_only=False):
    # The pdfs folder is actually at `c:\Users\USER\Documents\jamb ai generator\pdfs`
    # __file__ is `backend/scripts/load_all_subjects.py`
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    pdf_dir = os.path.join(base_dir, 'pdfs')
    store = SubjectVectorStore()
    
    if check_only:
        print_header("CURRENT SYSTEM STATUS")
        stats = store.get_subject_stats()
        total = 0
        for stat in stats:
            status_icon = "✅" if stat["loaded"] else "❌"
            print(f"[{status_icon}] {stat['subject'].capitalize():<12} : {stat['count']:>4} questions loaded")
            total += stat['count']
        print(f"─────────────────────────────────\nTOTAL READY: {total}\n═══════════════════════════════════════")
        return

    print_header("JAMB SUBJECT LOADER")
    
    # Define subjects in order and map their icons
    subject_configs = [
        ('biology', '📗', 'pdfs/biology.pdf'),
        ('physics', '📘', 'pdfs/physics.pdf'),
        ('chemistry', '📙', 'pdfs/chemistry.pdf'),
        ('mathematics', '📕', 'pdfs/mathematics.pdf')
    ]
    
    if target_subject:
        subject_configs = [s for s in subject_configs if s[0] == target_subject.lower()]
        if not subject_configs:
            print(f"❌ Unknown subject '{target_subject}'. Valid: biology, physics, chemistry, mathematics")
            return

    total_loaded = 0
    final_report = []

    for subj, icon, pdf_path in subject_configs:
        start_time = time.time()
        print(f"\n{icon} Processing {subj.capitalize()}...")
        abs_pdf_path = os.path.join(pdf_dir, f"{subj}.pdf")
            
        if not os.path.exists(abs_pdf_path):
            print(f"   PDF: {pdf_path} \u274c NOT FOUND at {abs_pdf_path}! Skipping.")
            final_report.append(f"{icon} {subj.capitalize():<12}:    0 questions \u274c (File missing)")
            continue
            
        print(f"   PDF: {pdf_path} ✅ Found")
        
        processor = UniversalPDFProcessor(subj)
        
        # Simulating extraction logs for the CLI aesthetic requested
        print("   Extracting text... \r", end="")
        result = processor.process(abs_pdf_path)
        stats = result['stats']
        
        if not result['success']:
            print(f"   Processing Failed: ❌ {stats.get('errors', ['Unknown Error'])[0]}")
            final_report.append(f"{icon} {subj.capitalize():<12}:    0 questions ❌ (Processing Failed)")
            continue
            
        print(f"   Extracting text... ✅ {stats['pages_processed']} pages")
        print(f"   Finding answers... ✅ {stats['answers_found']} answers found")
        print(f"   Extracting questions... ✅ {stats['questions_found']} questions found")
        print(f"   Parsing options... ✅ {stats['questions_parsed']} questions parsed")
        
        if stats['questions_failed'] > 0:
            print(f"   Failed: {stats['questions_failed']} questions (Missing options/diagrams)")
        
        print(f"   Creating embeddings... \r", end="")
        
        # Load into Vector Store (Embeds automatically via Chroma)
        store_result = store.load_subject(subj, result['questions'])
        
        if store_result['success']:
            print(f"   Creating embeddings... ✅ {store_result['loaded']} embeddings")
            print(f"   Storing in ChromaDB... ✅ Collection: jamb_{subj}")
            print(f"   ✅ {subj.capitalize()}: {store_result['loaded']} questions loaded! ({time.time() - start_time:.1f}s)")
            
            final_report.append(f"{icon} {subj.capitalize():<12}:  {store_result['loaded']:>3} questions ✅")
            total_loaded += store_result['loaded']
        else:
            print(f"   Storing in ChromaDB... ❌ Failed: {store_result.get('error')}")
            final_report.append(f"{icon} {subj.capitalize():<12}:    0 questions ❌ (DB Error)")

    # Print Final Summary
    print("\n═══════════════════════════════════════")
    print("📊 FINAL REPORT")
    print("═══════════════════════════════════════")
    for line in final_report:
        print(line)
    print("─────────────────────────────────")
    print(f"TOTAL:          {total_loaded} questions ready!")
    print("═══════════════════════════════════════")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JAMB Database Loader")
    parser.add_argument("--subject", type=str, help="Process only a specific subject")
    parser.add_argument("--check", action="store_true", help="Check current DB status without processing")
    args = parser.parse_args()
    
    load_subjects(target_subject=args.subject, check_only=args.check)
