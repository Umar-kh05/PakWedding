"""
Booking repository - handles Booking data access
Following Single Responsibility Principle
"""
from app.repositories.base_repository import BaseRepository


class BookingRepository(BaseRepository):
    """Booking-specific repository operations"""
    
    def __init__(self, database):
        super().__init__(database, "bookings")
    
    async def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100):
        """Get bookings by user ID"""
        from bson import ObjectId
        # Try both string and ObjectId format
        try:
            user_obj_id = ObjectId(user_id)
            # Try ObjectId first
            bookings = await self.find_many({"user_id": user_obj_id}, skip, limit)
            if bookings:
                return bookings
        except:
            pass
        
        # Fallback to string
        return await self.find_many({"user_id": user_id}, skip, limit)
    
    async def get_by_vendor_id(self, vendor_id: str, skip: int = 0, limit: int = 100):
        """Get bookings by vendor ID"""
        from bson import ObjectId
        # Try both string and ObjectId format
        try:
            vendor_obj_id = ObjectId(vendor_id)
            # Try ObjectId first
            bookings = await self.find_many({"vendor_id": vendor_obj_id}, skip, limit)
            if bookings:
                return bookings
        except:
            pass
        
        # Fallback to string
        return await self.find_many({"vendor_id": vendor_id}, skip, limit)
    
    async def get_by_status(self, status: str, skip: int = 0, limit: int = 100):
        """Get bookings by status"""
        return await self.find_many({"status": status}, skip, limit)

