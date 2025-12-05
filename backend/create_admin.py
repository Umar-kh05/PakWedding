"""
Script to create an admin user
Run this script to create an admin user in the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.security import hash_password
from datetime import datetime

async def create_admin():
    """Create admin user"""
    # Connect to database
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    # Admin credentials
    admin_email = "admin@pakwedding.com"
    admin_password = "admin123"  # Change this to a secure password
    admin_name = "Admin User"
    
    # Check if admin already exists
    existing_admin = await users_collection.find_one({"email": admin_email})
    if existing_admin:
        print(f"❌ Admin user with email '{admin_email}' already exists!")
        print(f"   You can login with:")
        print(f"   Email: {admin_email}")
        print(f"   Password: (the password you set when creating this admin)")
        client.close()
        return
    
    # Hash password
    hashed_password = hash_password(admin_password)
    
    # Create admin user
    admin_user = {
        "email": admin_email,
        "full_name": admin_name,
        "hashed_password": hashed_password,
        "role": "admin",
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    try:
        result = await users_collection.insert_one(admin_user)
        print("✅ Admin user created successfully!")
        print(f"\n📧 Login Credentials:")
        print(f"   Email: {admin_email}")
        print(f"   Password: {admin_password}")
        print(f"\n⚠️  IMPORTANT: Change the password after first login!")
        client.close()
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        client.close()

if __name__ == "__main__":
    print("Creating admin user...")
    asyncio.run(create_admin())

