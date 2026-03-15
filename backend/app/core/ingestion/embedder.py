from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from app.config import settings


class VectorStoreManager:
    def __init__(self):
        # Free local embeddings — no OpenAI needed at all
        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )

    def ingest(self, chunks: list[Document]) -> Chroma:
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            collection_name=settings.CHROMA_COLLECTION,
            persist_directory=settings.CHROMA_PERSIST_DIR,
        )
        vectorstore.persist()
        return vectorstore

    def load(self) -> Chroma:
        return Chroma(
            collection_name=settings.CHROMA_COLLECTION,
            embedding_function=self.embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR,
        )
