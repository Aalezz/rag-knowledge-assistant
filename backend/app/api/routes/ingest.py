from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.ingestion.loader import DocumentLoader
from app.core.ingestion.chunker import DocumentChunker
from app.core.ingestion.embedder import VectorStoreManager
from app.models.schemas import IngestResponse
import tempfile, shutil, os

router  = APIRouter()
loader  = DocumentLoader()
chunker = DocumentChunker()
vs_mgr  = VectorStoreManager()

ALLOWED = {".pdf", ".docx", ".txt"}

@router.post("/ingest", response_model=IngestResponse)
async def ingest_document(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED:
        raise HTTPException(400, f"File type '{ext}' not supported. Use PDF, DOCX, or TXT.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        docs   = loader.load(tmp_path)
        chunks = chunker.chunk(docs)
        vs_mgr.ingest(chunks)
        return IngestResponse(status="success", filename=file.filename, chunks_indexed=len(chunks))
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        os.unlink(tmp_path)
