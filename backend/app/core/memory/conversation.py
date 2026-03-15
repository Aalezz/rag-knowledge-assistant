import redis.asyncio as aioredis
import json
from app.config import settings


class ConversationMemory:
    def __init__(self):
        self.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        self.ttl = 3600  # 1 hour

    async def get_history(self, session_id: str) -> list:
        data = await self.redis.get(f"session:{session_id}")
        return json.loads(data) if data else []

    async def add_turn(self, session_id: str, question: str, answer: str):
        history = await self.get_history(session_id)
        history.append({"role": "user",      "content": question})
        history.append({"role": "assistant", "content": answer})
        history = history[-20:]  # keep last 10 turns
        await self.redis.setex(f"session:{session_id}", self.ttl, json.dumps(history))

    async def clear(self, session_id: str):
        await self.redis.delete(f"session:{session_id}")
