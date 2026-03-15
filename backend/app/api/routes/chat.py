from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import QueryRequest, ChatResponse, SourceDocument
from app.core.ingestion.embedder import VectorStoreManager
from app.core.generation.rag_chain import RAGPipeline
from app.core.memory.conversation import ConversationMemory
from app.utils.cache import SemanticCache
import json

router  = APIRouter()
vs_mgr  = VectorStoreManager()
memory  = ConversationMemory()
cache   = SemanticCache()


def get_pipeline() -> RAGPipeline:
    return RAGPipeline(vs_mgr.load())


@router.post("/chat", response_model=ChatResponse)
async def chat(request: QueryRequest):
    cached = await cache.get(request.question)
    if cached:
        return ChatResponse(**cached)

    try:
        result  = await get_pipeline().query(request.question)
        answer  = result["answer"]
        sources = [
            SourceDocument(
                content=doc.page_content[:300],
                source=doc.metadata.get("source", "unknown"),
                page=doc.metadata.get("page", 0),
                chunk_id=doc.metadata.get("chunk_id"),
            )
            for doc in result["source_documents"]
        ]
        await memory.add_turn(request.session_id, request.question, answer)
        response = ChatResponse(answer=answer, sources=sources, session_id=request.session_id)
        await cache.set(request.question, response.dict())
        return response
    except Exception as e:
        raise HTTPException(500, str(e))


@router.post("/chat/stream")
async def stream_chat(request: QueryRequest):
    async def event_generator():
        try:
            result  = await get_pipeline().query(request.question)
            answer  = result["answer"]
            sources = [
                {
                    "content":  doc.page_content[:300],
                    "source":   doc.metadata.get("source", "unknown"),
                    "page":     doc.metadata.get("page", 0),
                    "chunk_id": doc.metadata.get("chunk_id"),
                }
                for doc in result["source_documents"]
            ]
            await memory.add_turn(request.session_id, request.question, answer)

            for token in answer.split(" "):
                yield f"data: {json.dumps({'token': token + ' '})}\n\n"

            yield f"data: {json.dumps({'sources': sources, 'done': True})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.delete("/chat/{session_id}")
async def clear_session(session_id: str):
    await memory.clear(session_id)
    return {"status": "cleared", "session_id": session_id}
