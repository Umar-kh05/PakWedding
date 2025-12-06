"""
Script to initialize vendor stats for existing vendors
Run this to calculate and set stats for all vendors in the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.repositories.vendor_repository import VendorRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.review_repository import ReviewRepository
from app.services.vendor_stats_service import VendorStatsService

async def initialize_vendor_stats():
    """Initialize stats for all vendors"""
    print("Initializing vendor stats...")
    
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    db = client[settings.DATABASE_NAME]
    
    vendor_repo = VendorRepository(db)
    booking_repo = BookingRepository(db)
    review_repo = ReviewRepository(db)
    stats_service = VendorStatsService(vendor_repo, booking_repo, review_repo)
    
    # Get all vendors
    vendors = await vendor_repo.find_many({}, 0, 1000)
    
    updated_count = 0
    
    for vendor in vendors:
        try:
            vendor_id = str(vendor.get("_id"))
            print(f"Updating stats for: {vendor.get('business_name')}")
            await stats_service.update_vendor_stats(vendor_id)
            updated_count += 1
        except Exception as e:
            print(f"Error updating {vendor.get('business_name')}: {e}")
    
    print(f"\n[SUMMARY]")
    print(f"   Updated: {updated_count} vendors")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(initialize_vendor_stats())

