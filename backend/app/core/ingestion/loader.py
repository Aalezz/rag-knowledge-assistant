from langchain.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.schema import Document
from pathlib import Path


class DocumentLoader:
    LOADERS = {
        ".pdf":  PyPDFLoader,
        ".docx": Docx2txtLoader,
        ".txt":  TextLoader,
    }

    def load(self, file_path: str) -> list[Document]:
        ext = Path(file_path).suffix.lower()
        loader_cls = self.LOADERS.get(ext)
        if not loader_cls:
            raise ValueError(f"Unsupported file type: {ext}")
        docs = loader_cls(file_path).load()
        for doc in docs:
            doc.metadata["source"] = Path(file_path).name
        return docs
