from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient(settings.DATABASE_URL)
        try:
            await cls.client.admin.command('ping')
            print(f"Connected to MongoDB successfully")
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            raise
    
    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()
            print("MongoDB connection closed")
    
    @classmethod
    def get_database(cls):
        return cls.client[settings.DATABASE_NAME]


async def get_db():
    return Database.get_database()

