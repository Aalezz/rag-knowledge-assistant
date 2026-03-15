from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""          # only needed for embeddings
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION: str = "knowledge_base"
    REDIS_URL: str = "redis://redis:6379"
    CHUNK_SIZE: int = 1024            # larger chunks — Claude handles big context well
    CHUNK_OVERLAP: int = 128
    RETRIEVER_K: int = 6
    RETRIEVER_FETCH_K: int = 24
    LLM_MODEL: str = "claude-sonnet-4-5"
    EMBEDDING_MODEL: str = "text-embedding-3-small"  # OpenAI embeddings (Anthropic has no embeddings API)

    class Config:
        env_file = ".env"

settings = Settings()
