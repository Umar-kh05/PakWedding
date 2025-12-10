"""
Quick script to check reset tokens in the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

async def check_reset_tokens():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["pakwedding_db"]
    
    # Find all users with reset tokens
    users = await db["users"].find(
        {"reset_token": {"$exists": True}},
        {"email": 1, "reset_token": 1, "reset_token_expiry": 1}
    ).to_list(length=100)
    
    print(f"\n{'='*80}")
    print(f"Found {len(users)} users with reset tokens:")
    print(f"{'='*80}\n")
    
    for user in users:
        email = user.get("email", "N/A")
        token = user.get("reset_token", "N/A")
        expiry = user.get("reset_token_expiry")
        
        print(f"Email: {email}")
        print(f"Token: {token}")
        print(f"Expiry: {expiry}")
        
        if expiry:
            now = datetime.utcnow()
            if now > expiry:
                print(f"Status: ❌ EXPIRED (expired {now - expiry} ago)")
            else:
                print(f"Status: ✅ VALID (expires in {expiry - now})")
        else:
            print(f"Status: ⚠️  NO EXPIRY SET")
        
        print(f"{'-'*80}\n")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_reset_tokens())
