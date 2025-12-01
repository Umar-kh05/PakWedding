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
        # For MongoDB Atlas with mongodb+srv://, SSL is handled automatically
        # Don't set tls=True explicitly as it can conflict with SRV records
        cls.client = AsyncIOMotorClient(settings.DATABASE_URL)
        # Test the connection
        try:
            await cls.client.admin.command('ping')
            print(f"Connected to MongoDB successfully")
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            raise
    
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

