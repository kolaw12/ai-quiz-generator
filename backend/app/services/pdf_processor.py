import PyPDF2
import re
import logging
from typing import List, Dict, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PDFProcessor")

class UniversalPDFProcessor:
    """
    Processes JAMB past question PDFs for ANY subject.
    Handles multiple question/answer formats intelligently using robust regex splitting.
    """
    
    SUBJECT_CONFIG = {
        'biology': {
            'name': 'Biology',
            'question_patterns': [
                r'(?:^|\s)(\d+)\.\s*(.*?)(?=(?:\n|\s)\d+\.\s*|$)',
                r'(?:^|\s)(\d+)\)\s*(.*?)(?=(?:\n|\s)\d+\)\s*|$)'
            ]
        },
        'physics': {
            'name': 'Physics',
            'question_patterns': [
                # Handles missing spaces: "1.In a resonance tube..."
                r'(?:^|\s)(\d+)\.\s*(.*?)(?=(?:\n|\s)\d+\.\s*|$)',
                r'(?:^|\s)Q(\d+)[.:]\s*(.*?)(?=(?:\n|\s)Q\d+[.:]|$)',
            ]
        },
        'chemistry': {
            'name': 'Chemistry',
            'question_patterns': [
                r'(?:^|\s)(\d+)\.\s*(.*?)(?=(?:\n|\s)\d+\.\s*|$)',
            ]
        },
        'mathematics': {
            'name': 'Mathematics',
            'question_patterns': [
                r'(?:^|\s)(\d+)\.\s*(.*?)(?=(?:\n|\s)\d+\.\s*|$)',
            ]
        }
    }
    
    def __init__(self, subject: str):
        self.subject = subject.lower().strip()
        self.config = self.SUBJECT_CONFIG.get(
            self.subject, 
            self.SUBJECT_CONFIG['biology'] # Fallback
        )
        self.stats = {
            'pages_processed': 0,
            'questions_found': 0,
            'questions_parsed': 0,
            'questions_failed': 0,
            'answers_found': 0,
            'failed_questions': [],
            'errors': []
        }
    
    def process(self, pdf_path: str) -> dict:
        """Complete processing pipeline."""
        try:
            pages = self._extract_text(pdf_path)
            self.stats['pages_processed'] = len(pages)
            
            answer_dict = self._find_answers(pages)
            raw_questions = self._extract_questions(pages)
            parsed = self._parse_all_questions(raw_questions)
            complete = self._match_answers(parsed, answer_dict)
            valid = self._validate_all(complete)
            
            self.stats['questions_parsed'] = len(valid)
            self.stats['questions_failed'] = len(raw_questions) - len(valid)
            
            return {
                'subject': self.subject,
                'questions': valid,
                'stats': self.stats,
                'report': self._generate_report(),
                'success': len(valid) > 0
            }
            
        except Exception as e:
            self.stats['errors'].append(str(e))
            return {
                'subject': self.subject,
                'questions': [],
                'stats': self.stats,
                'report': f"❌ Failed to process {self.subject}: {e}",
                'success': False
            }
    
    def _extract_text(self, pdf_path: str) -> list:
        """Extract text from every page sequentially."""
        pages = []
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for i in range(len(reader.pages)):
                text = reader.pages[i].extract_text()
                if text and len(text.strip()) > 10:
                    pages.append({'page_num': i + 1, 'text': text})
        return pages
    
    def _find_answers(self, pages: list) -> dict:
        """Finds answer keys utilizing comprehensive patterns."""
        answer_dict = {}
        for page in pages:
            text = page['text']
            if "ANSWER" in text.upper() or text.count('\n') > 25:
                # Match "1. A", "1A", "1) A", "1 - A"
                matches = re.finditer(r'(?:^|\s)(\d+)[\.\)\-]?\s*([A-Da-d])(?:$|\s)', text)
                for match in matches:
                    q_num = int(match.group(1))
                    if q_num not in answer_dict:
                        answer_dict[q_num] = match.group(2).upper()
                        self.stats['answers_found'] += 1
        return answer_dict
    
    def _extract_questions(self, pages: list) -> list:
        """Extract raw blocks using subject-specific rules with DOTALL for multiline."""
        raw_questions = []
        seen = set()
        
        for page in pages:
            text = page['text']
            if "TABLE OF CONTENTS" in text.upper() or ("ANSWER" in text.upper() and "1." not in text):
                continue
                
            for pattern in self.config['question_patterns']:
                matches = list(re.finditer(pattern, text, re.DOTALL))
                for match in matches:
                    q_num = int(match.group(1))
                    q_text = match.group(2).strip()
                    
                    if q_num not in seen and len(q_text) > 5:
                        raw_questions.append({
                            'number': q_num,
                            'text': q_text,
                            'page': page['page_num']
                        })
                        seen.add(q_num)
                        
        self.stats['questions_found'] = len(raw_questions)
        return raw_questions
    
    def _parse_options(self, question_text: str) -> Optional[dict]:
        """
        Universal option extraction. Uses re.split to tear the string specifically
        at option identifiers (A. B. C. D.) without relying on spaces.
        Handles: A. text, A) text, (A) text, (a) text.
        """
        # Split regex: looks for A-E preceded by a boundary or space, followed by . or )
        split_pattern = r'(?:^|\s+|(?<=[^a-zA-Z]))([A-E])(?:\.|\))\s*'
        parts = re.split(split_pattern, question_text, flags=re.IGNORECASE)
        
        # If it failed to fracture into options, try bracketed: (A) (B)...
        if len(parts) < 5:
            parts = re.split(r'(?:^|\s+)\(([A-Ea-e])\)\s*', question_text)
            
        if len(parts) >= 5: # Prompt + A + text + B + text
            q_prompt = parts[0].strip()
            options = {}
            
            for i in range(1, len(parts), 2):
                if i + 1 < len(parts):
                    letter = parts[i].upper()
                    if letter in ['A', 'B', 'C', 'D', 'E']: # Support E just in case
                        options[letter] = parts[i+1].strip()
                        
            # Ensure we at least got A and B mapped
            if 'A' in options and 'B' in options:
                return {
                    'question': q_prompt,
                    'options': options
                }
                
        return None
    
    def _parse_all_questions(self, raw: list) -> list:
        """Parses options out of all extracted raw questions."""
        parsed = []
        for r in raw:
            p = self._parse_options(r['text'])
            if p:
                p['id'] = r['number']
                p['page'] = r['page']
                p['subject'] = self.subject
                parsed.append(p)
            else:
                self.stats['failed_questions'].append(f"Q{r['number']} (Pg {r['page']}): Failed isolating options.")
        return parsed
    
    def _match_answers(self, questions: list, answers: dict) -> list:
        """Attach located correct answers to questions. Default to A if absent."""
        for q in questions:
            q['correct_answer'] = answers.get(q['id'], 'A')
        return questions
    
    def _validate_all(self, questions: list) -> list:
        """Ensure all required fields exist to prevent frontend crashing."""
        valid = []
        for q in questions:
            if "diagram" in q['question'].lower() and len(q['question']) < 30:
                self.stats['failed_questions'].append(f"Q{q['id']}: Skipped diagram-reliant question.")
                continue
                
            if len(q.get('options', {})) >= 2:
                valid.append({
                    "id": q['id'],
                    "subject": q['subject'],
                    "type": "multiple_choice",
                    "question": q['question'],
                    "options": q['options'],
                    "correct_answer": q['correct_answer'],
                    "page": q['page']
                })
        return valid
    
    def _generate_report(self) -> str:
        """Returns a string report of the processing outcomes."""
        success_rate = 0
        if self.stats['questions_found'] > 0:
            success_rate = (self.stats['questions_parsed'] / self.stats['questions_found']) * 100
            
        report = f"==== {self.subject.upper()} PROCESSING REPORT ====\n"
        report += f"Pages Scanned: {self.stats['pages_processed']}\n"
        report += f"Answers Key Items Found: {self.stats['answers_found']}\n"
        report += f"Questions Extracted: {self.stats['questions_found']}\n"
        report += f"Successfully Parsed: {self.stats['questions_parsed']} ({success_rate:.1f}%)\n"
        report += f"Failed to Parse: {self.stats['questions_failed']}\n"
        
        if self.stats['errors']:
            report += f"\nERRORS: {len(self.stats['errors'])} occurred during processing.\n"
            
        return report
