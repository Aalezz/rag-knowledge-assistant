# 🧠 AI Knowledge Assistant — RAG System

A production-level **Retrieval-Augmented Generation (RAG)** system that lets users upload documents and ask questions about them using AI.

Powered by **Claude (Anthropic)** · Built with **FastAPI · LangChain · ChromaDB · Redis · React**

---

## 🚀 Features

- 📄 Upload PDF, DOCX, and TXT documents
- 🔍 Semantic search with vector embeddings
- 🤖 Context-aware Q&A powered by **Claude (claude-sonnet-4-5)**
- 💬 Streaming responses token by token
- 🧠 Conversation memory per session (Redis)
- 📚 Source highlighting — see exactly where the answer came from
- ⚡ Response caching with Redis
- 🐳 Fully Dockerized deployment

---

## 🏗️ Architecture

```
Frontend (React)
      ↓
FastAPI Backend
      ↓
RAG Pipeline (LangChain)
   ├── ChromaDB  → vector search
   ├── Claude API → answer generation
   └── Redis     → memory + cache
```

---

## ⚙️ Tech Stack

| Layer | Tool |
|-------|------|
| Backend | FastAPI + Python 3.11 |
| RAG Orchestration | LangChain |
| LLM | Claude claude-sonnet-4-5 (Anthropic) |
| Embeddings | OpenAI text-embedding-3-small |
| Vector DB | ChromaDB |
| Cache / Memory | Redis |
| Frontend | React 18 |
| Deployment | Docker + Docker Compose |

> **Note:** Anthropic does not provide an embeddings API.
> OpenAI embeddings are used only for vector search (very cheap ~$0.00002/1k tokens).
> The LLM (answering questions) is 100% Claude.

---

## 🛠️ Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/Aalezz/rag-knowledge-assistant.git
cd rag-knowledge-assistant
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in:
```
ANTHROPIC_API_KEY=sk-ant-...   ← get from console.anthropic.com
OPENAI_API_KEY=sk-...          ← get from platform.openai.com (embeddings only)
```

### 3. Run with Docker
```bash
docker-compose up --build
```

### 4. Open the app
- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs

---

## 🧪 Run Without Docker

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Redis (required)
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ingest` | Upload a document |
| POST | `/api/v1/chat` | Ask a question |
| POST | `/api/v1/chat/stream` | Streaming Q&A |
| DELETE | `/api/v1/chat/{session_id}` | Clear session memory |
| POST | `/api/v1/eval` | Evaluate response quality |
| GET | `/health` | Health check |

Interactive docs: **http://localhost:8000/docs**

---

## 📁 Project Structure

```
rag-knowledge-assistant/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app
│   │   ├── config.py             # Settings + env vars
│   │   ├── api/routes/           # ingest, chat, eval
│   │   ├── core/
│   │   │   ├── ingestion/        # loader, chunker, embedder
│   │   │   ├── generation/       # rag_chain (Claude), prompts
│   │   │   └── memory/           # Redis conversation memory
│   │   ├── models/schemas.py
│   │   └── utils/cache.py
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       └── components/
│           ├── ChatWindow.jsx
│           ├── DocumentUpload.jsx
│           └── SourceHighlight.jsx
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── .env.example
└── README.md
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key — **required** |
| `OPENAI_API_KEY` | OpenAI key for embeddings — **required** |
| `LLM_MODEL` | Claude model (default: `claude-sonnet-4-5`) |
| `EMBEDDING_MODEL` | Embedding model (default: `text-embedding-3-small`) |
| `CHUNK_SIZE` | Document chunk size (default: `1024`) |
| `REDIS_URL` | Redis connection (default: `redis://redis:6379`) |

---

## 👨‍💻 Author

**Alezz Aldumaini** — AI Engineer
- 🌐 Portfolio: [aalezz.github.io](https://aalezz.github.io)
- 🐙 GitHub: [github.com/Aalezz](https://github.com/Aalezz)
- 📧 Email: alezz.aldumaini@gmail.com
