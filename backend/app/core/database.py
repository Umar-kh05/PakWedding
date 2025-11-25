"""
Database connection management
Following Single Responsibility Principle
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    """MongoDB database connection manager"""
    
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        cls.client = AsyncIOMotorClient(settings.DATABASE_URL)
        print(f"Connected to MongoDB at {settings.DATABASE_URL}")
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("MongoDB connection closed")
    
    @classmethod
    def get_database(cls):
        """Get database instance"""
        return cls.client[settings.DATABASE_NAME]


async def get_db():
    """Dependency for getting database instance"""
    return Database.get_database()

