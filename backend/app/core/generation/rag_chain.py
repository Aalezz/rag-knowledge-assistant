import anthropic
from app.config import settings


class RAGPipeline:
    def __init__(self, vectorstore):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.retriever = vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": settings.RETRIEVER_K, "fetch_k": settings.RETRIEVER_FETCH_K},
        )
        self.history = []

    async def query(self, question: str) -> dict:
        docs = self.retriever.get_relevant_documents(question)
        context = "\n\n".join([d.page_content for d in docs])
        system = "You are an expert Knowledge Assistant. Answer strictly based on the provided context. If the answer is not found, say: I do not have enough information in the uploaded documents."
        user_msg = f"Context:\n{context}\n\nQuestion: {question}"
        response = self.client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=4096,
            system=system,
            messages=[*self.history, {"role": "user", "content": user_msg}],
        )
        answer = response.content[0].text
        self.history.append({"role": "user", "content": user_msg})
        self.history.append({"role": "assistant", "content": answer})
        if len(self.history) > 10:
            self.history = self.history[-10:]
        return {"answer": answer, "source_documents": docs}