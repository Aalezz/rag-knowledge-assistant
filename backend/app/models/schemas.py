from pydantic import BaseModel
from typing import Optional, List

class QueryRequest(BaseModel):
    question: str
    session_id: str = "default"

class SourceDocument(BaseModel):
    content: str
    source: str
    page: int = 0
    chunk_id: Optional[int] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceDocument]
    session_id: str

class IngestResponse(BaseModel):
    status: str
    filename: str
    chunks_indexed: int

class EvalRequest(BaseModel):
    question: str
    answer: str
    contexts: List[str]
    ground_truth: Optional[str] = None
