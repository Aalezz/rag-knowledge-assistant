from fastapi import APIRouter
from app.models.schemas import EvalRequest

router = APIRouter()

@router.post("/eval")
async def evaluate(request: EvalRequest):
    answer_len   = len(request.answer.split())
    context_hits = sum(
        1 for ctx in request.contexts
        if any(w in ctx.lower() for w in request.answer.lower().split()[:10])
    )
    faithfulness = round(min(context_hits / max(len(request.contexts), 1), 1.0), 2)

    return {
        "faithfulness":   faithfulness,
        "answer_length":  answer_len,
        "contexts_used":  len(request.contexts),
        "context_hits":   context_hits,
        "note": "Install ragas for full evaluation: pip install ragas",
    }
