"""
Script to ensure all approved vendors have is_active: True
This fixes vendors that were approved but might have is_active: False
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

async def fix_approved_vendors():
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    db = client[settings.DATABASE_NAME]
    
    # Find all approved vendors that don't have is_active: True
    query = {"is_approved": True, "is_active": {"$ne": True}}
    vendors_to_fix = await db.vendors.find(query).to_list(length=1000)
    
    print(f"Found {len(vendors_to_fix)} approved vendors with is_active != True")
    
    if vendors_to_fix:
        # Update them to have is_active: True
        result = await db.vendors.update_many(
            {"is_approved": True, "is_active": {"$ne": True}},
            {"$set": {"is_active": True}}
        )
        print(f"Updated {result.modified_count} vendors")
        
        # Show which vendors were fixed
        for vendor in vendors_to_fix[:10]:  # Show first 10
            print(f"  - Fixed: {vendor.get('business_name')}")
    else:
        print("No vendors need fixing!")
    
    # Verify the fix
    approved_active = await db.vendors.find({"is_approved": True, "is_active": True}).to_list(length=1000)
    print(f"\nTotal approved and active vendors: {len(approved_active)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_approved_vendors())

