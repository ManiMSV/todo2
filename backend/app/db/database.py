from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings


class MongoDatabase:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


mongo = MongoDatabase()


async def connect_to_mongo() -> None:
    mongo.client = AsyncIOMotorClient(settings.mongodb_url)
    mongo.db = mongo.client[settings.mongodb_db_name]


async def close_mongo_connection() -> None:
    if mongo.client is not None:
        mongo.client.close()
        mongo.client = None
        mongo.db = None


def get_database() -> AsyncIOMotorDatabase:
    if mongo.db is None:
        raise RuntimeError("Database is not initialized")
    return mongo.db
