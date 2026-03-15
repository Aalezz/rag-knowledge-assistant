from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import ingest, chat, eval
from app.config import settings

app = FastAPI(
    title="AI Knowledge Assistant",
    description="Production RAG system powered by Claude (Anthropic)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router, prefix="/api/v1", tags=["Ingestion"])
app.include_router(chat.router,   prefix="/api/v1", tags=["Chat"])
app.include_router(eval.router,   prefix="/api/v1", tags=["Evaluation"])

@app.get("/health")
def health():
    return {"status": "ok", "model": settings.LLM_MODEL, "version": "1.0.0"}
