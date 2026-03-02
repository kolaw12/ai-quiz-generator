# 🧠 JAMB Quiz Master

> An AI-powered JAMB exam preparation platform designed to help Nigerian students secure 300+ by understanding concepts, not just cramming answers.

![JAMB Quiz Master Banner](https://via.placeholder.com/1200x400/0f172a/ffffff?text=JAMB+Quiz+Master+-+AI+Powered+Exam+Prep)

## ✨ Features

- 📚 **Core Subjects Supported**: Mathematics, Physics, Chemistry, and Biology.
- 🤖 **AI Private Tutor**: Answers wrong? The built-in AI explains the step-by-step formula and concept instantly (Powered by Llama 3).
- 🎯 **Smart RAG Quizzes**: Questions compiled directly from historical JAMB PDFs using Vector Databases.
- 📊 **Analytics Dashboard**: Track your mock score improvements and daily streaks.
- 🌙 **TDB Mode**: Beautiful dark mode for late-night "Till Day Break" study sessions.
- 📱 **Fully Responsive**: Study efficiently on any Android or iOS device.

## 📸 Screenshots

| Dashboard | Quiz Interface | AI Explanation |
|---|---|---|
| ![Landing](https://via.placeholder.com/300x500/1e293b/ffffff?text=User+Dashboard) | ![Quiz](https://via.placeholder.com/300x500/1e293b/ffffff?text=Quiz+Interface) | ![Results](https://via.placeholder.com/300x500/1e293b/ffffff?text=AI+Explanation) |

*(Note: Replace placeholder images with actual screenshots in the `screenshots/` folder)*

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript & Tailwind CSS
- Framer Motion (Micro-animations)
- Recharts (Score analytics)

### Backend
- FastAPI (Python)
- ChromaDB (Vector Database for RAG)
- SentenceTransformers (Embeddings)
- Groq API (Llama 3.3 70B LLM for Explanations)
- SQLite + SQLAlchemy

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.10+
- Groq API Key (Get one free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/jamb-quiz-master.git
cd jamb-quiz-master
```

### 2. Set up the Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run the backend
uvicorn app.main:app --reload
```
*The backend will be running at http://127.0.0.1:8000*

### 3. Set up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install

# Set up environment variables
cp .env.local.example .env.local

# Run the frontend
npm run dev
```
*The web app will be running at http://localhost:3000*

## 📁 Key Project Structure
```text
jamb-quiz-master/
├── frontend/          # Next.js UI & Web App
│   ├── src/           # Components, Pages, and Context
│   └── public/        # Static assets
└── backend/           # FastAPI & RAG Engine
    ├── app/           # Routes, Services, Models
    ├── pdfs/          # Past Question sources
    └── tests/         # Pytest coverage
```

## 🤝 Contributing
Contributions are totally welcome! If you want to add more subjects (like English or Government), feel free to open a Pull Request.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author
**Moses** 
- GitHub: [Your GitHub Link]
- Twitter/X: [Your Twitter Link]

---
*Built with ❤️ for Nigerian students 🇳🇬*
