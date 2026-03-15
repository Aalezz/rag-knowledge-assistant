from langchain.prompts import PromptTemplate

RAG_PROMPT = PromptTemplate(
    input_variables=["context", "chat_history", "question"],
    template="""You are an expert Knowledge Assistant. Your job is to answer questions strictly and only based on the provided context documents.

Rules:
- If the answer is not found in the context, say: "I don't have enough information in the uploaded documents to answer this."
- Always mention the source document name and page number when available.
- Be concise, accurate, and professional.
- Do not make up information or use knowledge outside the provided context.

Context Documents:
{context}

Conversation History:
{chat_history}

User Question: {question}

Answer:"""
)

CONDENSE_PROMPT = PromptTemplate(
    input_variables=["chat_history", "question"],
    template="""Given the conversation history below and a follow-up question, rewrite the follow-up question
as a complete standalone question that includes all necessary context from the history.

Conversation History:
{chat_history}

Follow-up Question: {question}

Standalone Question:"""
)
