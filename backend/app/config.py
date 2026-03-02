"""
Configuration and Settings Management

This module handles all environment variables and application configuration.
Uses Pydantic Settings for validation and type checking.

Environment variables should be set in a .env file in the root of the backend directory.
"""

from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    All critical settings are validated and type-checked.
    Defaults are provided for development, but must be overridden for production.
    
    SECURITY: Never hardcode sensitive values. Always use environment variables.
    """
    
    # ════════════════════════════════════════════════════════
    # APPLICATION SETTINGS
    # ════════════════════════════════════════════════════════
    
    APP_NAME: str = "JAMB AI Quiz System"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Production-grade JAMB quiz platform with RAG-powered explanations"
    
    # Environment mode
    ENVIRONMENT: str = "development"  # "development", "staging", "production"
    DEBUG: bool = True
    
    # ════════════════════════════════════════════════════════
    # SERVER SETTINGS
    # ════════════════════════════════════════════════════════
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True  # Auto-reload on code changes (dev only)
    WORKERS: int = 4  # Number of uvicorn workers (production)
    
    # ════════════════════════════════════════════════════════
    # DATABASE SETTINGS (PostgreSQL)
    # ════════════════════════════════════════════════════════
    
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/jamb_quiz"
    """
    PostgreSQL connection string format:
    postgresql://username:password@host:port/dbname
    
    In production, use environment variables:
    DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
    """
    
    DATABASE_ECHO: bool = True  # Log all SQL queries (dev only)
    DATABASE_POOL_SIZE: int = 20  # Connection pool size
    DATABASE_MAX_OVERFLOW: int = 10  # Max overflow connections
    DATABASE_POOL_RECYCLE: int = 3600  # Recycle connections every hour
    
    # ════════════════════════════════════════════════════════
    # CHROMADB SETTINGS (Vector Database)
    # ════════════════════════════════════════════════════════
    
    CHROMADB_PERSIST_DIRECTORY: str = "./chroma_db"
    """
    Directory where ChromaDB persists its data.
    In production, could be mounted volume or cloud storage.
    """
    
    CHROMADB_COLLECTION_NAME: str = "jamb_questions"
    
    # ════════════════════════════════════════════════════════
    # SECURITY SETTINGS
    # ════════════════════════════════════════════════════════
    
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    """
    Used for JWT token signing and encryption.
    CRITICAL: Must be set in production via environment variable.
    Generate with: openssl rand -hex 32
    """
    
    ALGORITHM: str = "HS256"  # JWT signing algorithm
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 24 * 60  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # CORS settings
    CORS_ORIGINS: list = [
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:8000",  # FastAPI dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]
    """
    Allowed origins for CORS requests.
    In production, restrict to your actual frontend domain.
    Example: ["https://myapp.com", "https://www.myapp.com"]
    """
    
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]
    
    # ════════════════════════════════════════════════════════
    # GROQ API SETTINGS (LLM)
    # ════════════════════════════════════════════════════════
    
    GROQ_API_KEY: str = ""  # Must be set in .env file
    """
    Groq API key for accessing Llama 3.3 70B model.
    Get from: https://console.groq.com/keys
    CRITICAL: Never commit this to version control!
    """
    
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_TEMPERATURE: float = 0.5
    GROQ_MAX_TOKENS: int = 500
    """
    Explanation generation parameters:
    - temperature: 0.5 = balanced creativity & accuracy
    - max_tokens: 500 = detailed but concise explanations
    """
    
    # ════════════════════════════════════════════════════════
    # PDF PROCESSING SETTINGS
    # ════════════════════════════════════════════════════════
    
    UPLOAD_DIRECTORY: str = "./uploads"
    """Directory where user PDFs are stored"""
    
    MAX_UPLOAD_SIZE_MB: int = 50
    """Maximum PDF file size in MB"""
    
    ALLOWED_PDF_TYPES: list = ["application/pdf"]
    """Only PDFs allowed"""
    
    # ════════════════════════════════════════════════════════
    # EMBEDDING SETTINGS
    # ════════════════════════════════════════════════════════
    
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    """
    SentenceTransformer model for creating embeddings.
    all-MiniLM-L6-v2:
    - Fast & lightweight (22MB)
    - 384 dimensions
    - Good for semantic search
    - Runs on CPU
    """
    
    EMBEDDING_DIMENSION: int = 384  # Dimensions of embeddings from all-MiniLM-L6-v2
    
    # ════════════════════════════════════════════════════════
    # QUIZ SETTINGS
    # ════════════════════════════════════════════════════════
    
    MIN_QUIZ_QUESTIONS: int = 5
    MAX_QUIZ_QUESTIONS: int = 50
    DEFAULT_QUIZ_QUESTIONS: int = 10
    
    # ════════════════════════════════════════════════════════
    # RATE LIMITING
    # ════════════════════════════════════════════════════════
    
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100  # Requests per minute
    RATE_LIMIT_PERIOD: int = 60  # Period in seconds
    
    # ════════════════════════════════════════════════════════
    # LOGGING SETTINGS
    # ════════════════════════════════════════════════════════
    
    LOG_LEVEL: str = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    LOG_FILE: str = "./logs/app.log"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # ════════════════════════════════════════════════════════
    # REDIS SETTINGS (Optional - for caching)
    # ════════════════════════════════════════════════════════
    
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    """
    Redis connection for caching and sessions.
    Leave empty to disable Redis.
    """
    
    # ════════════════════════════════════════════════════════
    # PYDANTIC SETTINGS
    # ════════════════════════════════════════════════════════
    
    class Config:
        """Pydantic configuration for loading from .env files"""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    
    Uses @lru_cache to load settings only once.
    Subsequent calls return the cached instance.
    
    Usage:
        settings = get_settings()
        db_url = settings.DATABASE_URL
    
    Returns:
        Settings: Validated settings instance
    """
    return Settings()


# Export settings for easy importing throughout the app
settings = get_settings()
