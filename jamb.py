# JAMB Quiz with Quiz Mode - Phase 6A (FIXED)
# Built by Moses

from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import PyPDF2
from groq import Groq
import gradio as gr
import re
import random

print("🚀 Starting JAMB Quiz with Quiz Mode...")

# GROQ API KEY
GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"  # Replace!

groq_client = Groq(api_key=GROQ_API_KEY)

# STEP 1: LOAD PDF
print("\n📄 Loading PDF...")

pdf_path = "./pdfs/biology.pdf"

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    
    all_pages = []
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        all_pages.append({
            'page_num': page_num,
            'text': text
        })

print(f"✅ Loaded {len(all_pages)} pages")

# STEP 2: EXTRACT QUESTIONS AND ANSWERS
print("\n🔍 Extracting questions and answers...")

questions = []
answer_dict = {}

for page in all_pages:
    text = page['text']
    
    if "ANSWER" in text.upper() and text.count('\n') < 100:
        lines = text.split('\n')
        for line in lines:
            match = re.match(r'^\s*(\d+)\.\s*([A-D])', line.strip())
            if match:
                q_num = int(match.group(1))
                answer = match.group(2)
                answer_dict[q_num] = answer
    else:
        pattern = r'(\d+)\.\s+(.+?)(?=\n\s*\d+\.\s+|\Z)'
        matches = re.finditer(pattern, text, re.DOTALL)
        
        for match in matches:
            q_num = int(match.group(1))
            q_text = match.group(2).strip()
            
            if len(q_text) > 50:
                questions.append({
                    'number': q_num,
                    'text': q_text,
                    'page': page['page_num']
                })

print(f"✅ Found {len(questions)} questions")
print(f"✅ Found {len(answer_dict)} answers")

# STEP 3: PARSE OPTIONS
print("\n🔤 Parsing answer options...")

def parse_question(question_text):
    parts = re.split(r'\n\s*([A-D])\.\s+', question_text)
    
    if len(parts) < 2:
        return None
    
    question = parts[0].strip()
    options = {}
    
    for i in range(1, len(parts), 2):
        if i+1 < len(parts):
            option_letter = parts[i]
            option_text = parts[i+1].strip().split('\n')[0]
            options[option_letter] = option_text
    
    return {
        'question': question,
        'options': options
    }

parsed_questions = []
for q in questions:
    parsed = parse_question(q['text'])
    if parsed and len(parsed['options']) == 4:
        parsed_questions.append({
            'number': q['number'],
            'question': parsed['question'],
            'options': parsed['options'],
            'answer': answer_dict.get(q['number'], '?'),
            'page': q['page']
        })

print(f"✅ Parsed {len(parsed_questions)} complete questions")

# STEP 4: CREATE EMBEDDINGS
print("\n🧮 Creating embeddings...")

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

question_texts = [q['question'] + ' ' + ' '.join(q['options'].values()) 
                  for q in parsed_questions]
embeddings = embedding_model.encode(question_texts)

# STEP 5: CHROMADB (FIXED VERSION)
print("\n💾 Creating vector database...")

chroma_client = chromadb.Client(Settings(
    persist_directory="./quiz_mode_db",
    is_persistent=True
))

# Delete old collection if exists
try:
    chroma_client.delete_collection("jamb_quiz")
    print("🗑️ Deleted old database")
except:
    print("📁 Creating new database")

# Create fresh collection
collection = chroma_client.create_collection("jamb_quiz")

ids = [f"q_{q['number']}" for q in parsed_questions]

# Remove duplicates if any
unique_ids = []
unique_embeddings = []
unique_texts = []
unique_metadatas = []

seen_ids = set()
for i, id in enumerate(ids):
    if id not in seen_ids:
        seen_ids.add(id)
        unique_ids.append(id)
        unique_embeddings.append(embeddings[i].tolist())
        unique_texts.append(question_texts[i])
        unique_metadatas.append({
            'question_number': str(parsed_questions[i]['number']),
            'page': str(parsed_questions[i]['page']),
            'answer': parsed_questions[i]['answer']
        })

collection.add(
    ids=unique_ids,
    embeddings=unique_embeddings,
    documents=unique_texts,
    metadatas=unique_metadatas
)

print(f"✅ Database ready with {len(unique_ids)} unique questions")

# STEP 6: QUIZ SESSION CLASS
class QuizSession:
    def __init__(self):
        self.questions = []
        self.current_index = 0
        self.score = 0
        self.answers = []
        self.started = False
    
    def start_quiz(self, num_questions=10, topic=None):
        if topic:
            query_embedding = embedding_model.encode([topic])[0]
            results = collection.query(
                query_embeddings=[query_embedding.tolist()],
                n_results=min(num_questions, len(parsed_questions))
            )
            
            question_ids = [id.replace('q_', '') for id in results['ids'][0]]
            self.questions = [q for q in parsed_questions 
                            if str(q['number']) in question_ids]
        else:
            self.questions = random.sample(parsed_questions, 
                                         min(num_questions, len(parsed_questions)))
        
        self.current_index = 0
        self.score = 0
        self.answers = []
        self.started = True
        
        return self.get_current_question()
    
    def get_current_question(self):
        if self.current_index >= len(self.questions):
            return None
        
        q = self.questions[self.current_index]
        return {
            'number': self.current_index + 1,
            'total': len(self.questions),
            'question': q['question'],
            'options': q['options'],
            'q_id': q['number']
        }
    
    def submit_answer(self, selected_option):
        if self.current_index >= len(self.questions):
            return None
        
        q = self.questions[self.current_index]
        correct = q['answer']
        is_correct = (selected_option == correct)
        
        if is_correct:
            self.score += 1
        
        self.answers.append({
            'question': q['question'],
            'selected': selected_option,
            'correct': correct,
            'is_correct': is_correct
        })
        
        self.current_index += 1
        
        return {
            'is_correct': is_correct,
            'correct_answer': correct,
            'explanation': self.get_explanation(q['question'], correct)
        }
    
    def get_explanation(self, question, answer):
        try:
            prompt = f"""Question: {question[:200]}...
The correct answer is {answer}. Briefly explain why (2 sentences)."""

            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a biology teacher."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Option {answer} is the correct answer."
    
    def get_results(self):
        percentage = (self.score / len(self.questions) * 100) if self.questions else 0
        
        return {
            'score': self.score,
            'total': len(self.questions),
            'percentage': percentage,
            'answers': self.answers
        }

quiz_session = QuizSession()

# [REST OF THE GRADIO CODE STAYS THE SAME - Keep your Tab interface code here]

# STEP 7: GRADIO INTERFACE WITH QUIZ MODE
print("\n🌐 Creating dual-mode interface...")

# STEP 7: GRADIO INTERFACE WITH INSTANT FEEDBACK
print("\n🌐 Creating interface with instant feedback...")

with gr.Blocks(theme="soft", title="JAMB Quiz System") as demo:
    gr.Markdown("# 🧠 JAMB Biology Quiz System by Moses")
    gr.Markdown("Choose your mode: **Search Mode** or **Quiz Mode**")
    
    with gr.Tabs() as tabs:
        # TAB 1: SEARCH MODE (Same as before - no changes)
        with gr.Tab("🔍 Search Mode"):
            gr.Markdown("### Search for questions by topic")
            
            search_input = gr.Textbox(
                label="Search Topic",
                placeholder="e.g., cell biology, photosynthesis, DNA"
            )
            search_btn = gr.Button("Search", variant="primary")
            search_output = gr.Markdown()
            
            def search_questions(topic):
                query_embedding = embedding_model.encode([topic])[0]
                results = collection.query(
                    query_embeddings=[query_embedding.tolist()],
                    n_results=3
                )
                
                if not results['documents'][0]:
                    return "❌ No questions found."
                
                response = "📚 **SEARCH RESULTS**\n\n"
                
                for i in range(len(results['documents'][0])):
                    metadata = results['metadatas'][0][i]
                    q_num = metadata['question_number']
                    answer = metadata['answer']
                    
                    full_q = next((q for q in parsed_questions 
                                 if str(q['number']) == q_num), None)
                    
                    if full_q:
                        response += f"### Question {i+1} (Q#{q_num})\n\n"
                        response += f"{full_q['question']}\n\n"
                        for opt, text in full_q['options'].items():
                            response += f"**{opt}.** {text}\n"
                        response += f"\n✅ **Answer: {answer}**\n\n"
                        
                        # Get explanation
                        try:
                            prompt = f"""Question: {full_q['question']}
The correct answer is {answer}. Explain why in 2-3 sentences."""
                            
                            ai_response = groq_client.chat.completions.create(
                                model="llama-3.3-70b-versatile",
                                messages=[
                                    {"role": "system", "content": "You are a biology teacher."},
                                    {"role": "user", "content": prompt}
                                ],
                                temperature=0.7,
                                max_tokens=150
                            )
                            
                            explanation = ai_response.choices[0].message.content.strip()
                            response += f"💡 **Explanation:** {explanation}\n\n"
                        except:
                            response += f"💡 **Explanation:** Option {answer} is the correct answer.\n\n"
                        
                        response += "="*60 + "\n\n"
                
                return response
            
            search_btn.click(search_questions, inputs=search_input, outputs=search_output)
        
        # TAB 2: QUIZ MODE (IMPROVED WITH INSTANT FEEDBACK!)
        with gr.Tab("🎯 Quiz Mode"):
            gr.Markdown("### Take a practice quiz with instant feedback!")
            
            # Quiz Setup
            with gr.Row():
                num_questions = gr.Slider(
                    minimum=5,
                    maximum=20,
                    value=10,
                    step=1,
                    label="Number of Questions"
                )
                quiz_topic = gr.Textbox(
                    label="Topic (optional)",
                    placeholder="Leave empty for random questions"
                )
            
            start_btn = gr.Button("🚀 Start Quiz", variant="primary", size="lg")
            
            # Quiz Interface
            quiz_container = gr.Column(visible=False)
            
            with quiz_container:
                progress = gr.Markdown()
                question_text = gr.Markdown()
                
                # Answer buttons in a row
                with gr.Row():
                    option_a = gr.Button("A", size="lg", scale=1, variant="secondary")
                    option_b = gr.Button("B", size="lg", scale=1, variant="secondary")
                    option_c = gr.Button("C", size="lg", scale=1, variant="secondary")
                    option_d = gr.Button("D", size="lg", scale=1, variant="secondary")
                
                # INSTANT FEEDBACK SECTION (Shows immediately after clicking answer)
                feedback_box = gr.Column(visible=False)
                
                with feedback_box:
                    feedback_result = gr.Markdown()  # ✅ Correct or ❌ Incorrect
                    feedback_explanation = gr.Markdown()  # AI explanation
                    
                    with gr.Row():
                        next_btn = gr.Button("➡️ Next Question", variant="primary", size="lg")
            
            # Results Container
            results_container = gr.Column(visible=False)
            with results_container:
                results_text = gr.Markdown()
                restart_btn = gr.Button("🔄 Take Another Quiz", variant="primary", size="lg")
            
            # QUIZ LOGIC FUNCTIONS
            
            def start_quiz_fn(num_q, topic):
                """Start a new quiz"""
                topic = topic.strip() if topic else None
                q_data = quiz_session.start_quiz(int(num_q), topic)
                
                if not q_data:
                    return {
                        quiz_container: gr.update(visible=False),
                        progress: "",
                        question_text: "❌ No questions available"
                    }
                
                progress_text = f"**Question {q_data['number']}/{q_data['total']}** | Score: 0/{q_data['total']}"
                
                q_text = f"### {q_data['question']}\n\n"
                for opt in ['A', 'B', 'C', 'D']:
                    q_text += f"**{opt}.** {q_data['options'][opt]}\n\n"
                
                return {
                    quiz_container: gr.update(visible=True),
                    results_container: gr.update(visible=False),
                    progress: progress_text,
                    question_text: q_text,
                    feedback_box: gr.update(visible=False),
                    option_a: gr.update(interactive=True, variant="secondary"),
                    option_b: gr.update(interactive=True, variant="secondary"),
                    option_c: gr.update(interactive=True, variant="secondary"),
                    option_d: gr.update(interactive=True, variant="secondary")
                }
            
            def submit_answer_fn(selected):
                """
                Handle answer submission with INSTANT FEEDBACK
                """
                result = quiz_session.submit_answer(selected)
                
                # Prepare feedback
                if result['is_correct']:
                    feedback_header = f"## ✅ **CORRECT!**\n\n"
                    feedback_header += f"You selected **{selected}** - that's right!\n\n"
                else:
                    feedback_header = f"## ❌ **INCORRECT**\n\n"
                    feedback_header += f"You selected **{selected}**, but the correct answer is **{result['correct_answer']}**\n\n"
                
                feedback_exp = f"### 💡 Explanation:\n\n{result['explanation']}"
                
                # Check if quiz is complete
                q_data = quiz_session.get_current_question()
                
                if not q_data:
                    # Quiz finished - show results
                    results = quiz_session.get_results()
                    
                    results_md = f"# 🎉 Quiz Complete!\n\n"
                    results_md += f"## Your Score: **{results['score']}/{results['total']}** ({results['percentage']:.1f}%)\n\n"
                    
                    if results['percentage'] >= 80:
                        results_md += "### 🌟 **Excellent work!** You've mastered this topic!\n\n"
                    elif results['percentage'] >= 60:
                        results_md += "### 👍 **Good job!** Keep practicing to improve!\n\n"
                    else:
                        results_md += "### 📚 **Keep practicing!** Review the explanations below.\n\n"
                    
                    results_md += "---\n\n### 📋 Detailed Review:\n\n"
                    
                    for i, ans in enumerate(results['answers'], 1):
                        if ans['is_correct']:
                            results_md += f"**Q{i}:** ✅ Correct - You answered **{ans['selected']}**\n\n"
                        else:
                            results_md += f"**Q{i}:** ❌ You answered **{ans['selected']}**, correct was **{ans['correct']}**\n\n"
                    
                    return {
                        feedback_box: gr.update(visible=True),
                        feedback_result: feedback_header,
                        feedback_explanation: feedback_exp,
                        quiz_container: gr.update(visible=False),
                        results_container: gr.update(visible=True),
                        results_text: results_md,
                        option_a: gr.update(interactive=False),
                        option_b: gr.update(interactive=False),
                        option_c: gr.update(interactive=False),
                        option_d: gr.update(interactive=False)
                    }
                
                # More questions remaining - show feedback and next button
                return {
                    feedback_box: gr.update(visible=True),
                    feedback_result: feedback_header,
                    feedback_explanation: feedback_exp,
                    option_a: gr.update(interactive=False, variant="secondary"),
                    option_b: gr.update(interactive=False, variant="secondary"),
                    option_c: gr.update(interactive=False, variant="secondary"),
                    option_d: gr.update(interactive=False, variant="secondary")
                }
            
            def next_question_fn():
                """Load next question"""
                q_data = quiz_session.get_current_question()
                
                if not q_data:
                    return {}
                
                progress_text = f"**Question {q_data['number']}/{q_data['total']}** | Score: {quiz_session.score}/{q_data['number']-1}"
                
                q_text = f"### {q_data['question']}\n\n"
                for opt in ['A', 'B', 'C', 'D']:
                    q_text += f"**{opt}.** {q_data['options'][opt]}\n\n"
                
                return {
                    progress: progress_text,
                    question_text: q_text,
                    feedback_box: gr.update(visible=False),
                    option_a: gr.update(interactive=True, variant="secondary"),
                    option_b: gr.update(interactive=True, variant="secondary"),
                    option_c: gr.update(interactive=True, variant="secondary"),
                    option_d: gr.update(interactive=True, variant="secondary")
                }
            
            def restart_quiz_fn():
                """Restart quiz"""
                return {
                    quiz_container: gr.update(visible=False),
                    results_container: gr.update(visible=False),
                    feedback_box: gr.update(visible=False)
                }
            
            # EVENT HANDLERS
            start_btn.click(
                start_quiz_fn,
                inputs=[num_questions, quiz_topic],
                outputs=[
                    quiz_container, results_container, progress, question_text,
                    feedback_box, option_a, option_b, option_c, option_d
                ]
            )
            
            # Answer button clicks - INSTANT FEEDBACK!
            option_a.click(
                lambda: submit_answer_fn('A'),
                outputs=[
                    feedback_box, feedback_result, feedback_explanation,
                    quiz_container, results_container, results_text,
                    option_a, option_b, option_c, option_d
                ]
            )
            
            option_b.click(
                lambda: submit_answer_fn('B'),
                outputs=[
                    feedback_box, feedback_result, feedback_explanation,
                    quiz_container, results_container, results_text,
                    option_a, option_b, option_c, option_d
                ]
            )
            
            option_c.click(
                lambda: submit_answer_fn('C'),
                outputs=[
                    feedback_box, feedback_result, feedback_explanation,
                    quiz_container, results_container, results_text,
                    option_a, option_b, option_c, option_d
                ]
            )
            
            option_d.click(
                lambda: submit_answer_fn('D'),
                outputs=[
                    feedback_box, feedback_result, feedback_explanation,
                    quiz_container, results_container, results_text,
                    option_a, option_b, option_c, option_d
                ]
            )
            
            # Next question button
            next_btn.click(
                next_question_fn,
                outputs=[
                    progress, question_text, feedback_box,
                    option_a, option_b, option_c, option_d
                ]
            )
            
            # Restart button
            restart_btn.click(
                restart_quiz_fn,
                outputs=[quiz_container, results_container, feedback_box]
            )

print("\n✨ JAMB Quiz with Instant Feedback Ready!")
print("🎯 Students get immediate feedback after each answer!")

demo.launch()