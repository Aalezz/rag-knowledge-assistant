import redis.asyncio as aioredis
import json
import hashlib
from app.config import settings


class SemanticCache:
    def __init__(self):
        self.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        self.ttl = 86400  # 24 hours

    def _hash(self, question: str) -> str:
        return hashlib.md5(question.strip().lower().encode()).hexdigest()

    async def get(self, question: str):
        data = await self.redis.get(f"cache:{self._hash(question)}")
        return json.loads(data) if data else None

    async def set(self, question: str, response: dict):
        await self.redis.setex(
            f"cache:{self._hash(question)}",
            self.ttl,
            json.dumps(response),
        )
