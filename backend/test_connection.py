"""
Test MongoDB Atlas connection
Run this script to verify your connection string works
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def test_connection():
    print(f"Testing connection to: {settings.DATABASE_URL}")
    print(f"Database name: {settings.DATABASE_NAME}")
    print("-" * 50)
    
    try:
        client = AsyncIOMotorClient(settings.DATABASE_URL)
        # Test connection
        await client.admin.command('ping')
        print("✅ Connection successful!")
        
        # List databases
        db_list = await client.list_database_names()
        print(f"✅ Available databases: {db_list}")
        
        # Test database access
        db = client[settings.DATABASE_NAME]
        collections = await db.list_collection_names()
        print(f"✅ Collections in {settings.DATABASE_NAME}: {collections}")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nTroubleshooting steps:")
        print("1. Check your .env file - make sure DATABASE_URL is correct")
        print("2. Verify password doesn't have special characters (or URL encode them)")
        print("3. Check MongoDB Atlas Network Access - your IP must be whitelisted")
        print("4. Verify database user credentials in Atlas")

if __name__ == "__main__":
    asyncio.run(test_connection())

