import PyPDF2
import os

pdf_dir = "./pdfs"

for filename in os.listdir(pdf_dir):
    if filename.endswith('.pdf'):
        filepath = os.path.join(pdf_dir, filename)
        print(f"\n{'='*60}")
        print(f"FILE: {filename}")
        print(f"{'='*60}")
        
        try:
            with open(filepath, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                num_pages = len(reader.pages)
                print(f"Total pages: {num_pages}")
                
                # Print first 2 pages
                for i in range(min(2, num_pages)):
                    text = reader.pages[i].extract_text()
                    print(f"\n--- PAGE {i+1} ---")
                    print(text[:1000])  # First 1000 chars
                    print("...")
                        
        except Exception as e:
            print(f"Error: {e}")
