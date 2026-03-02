from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import database and routers
from app.database import engine, Base
from app.routes import auth_routes, quiz_routes, subject_routes, admin_routes

# Initialize SQLite tables safely on boot
print("Initializing SQLite database...")
Base.metadata.create_all(bind=engine)
print("Database ready.")

app = FastAPI(
    title="JAMB Quiz Master API",
    description="Production-Ready API with Auth & RAG Quiz Generation",
    version="2.0.0"
)

# Standard Security Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://jamb-quiz.vercel.app"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "FastAPI is running with Auth active!"}

# Register all modular route controllers
app.include_router(auth_routes.router)
app.include_router(quiz_routes.router)
app.include_router(subject_routes.router)
app.include_router(admin_routes.router)

if __name__ == "__main__":
    print("Starting Production Server...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
