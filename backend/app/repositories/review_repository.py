"""
Review repository
"""
from app.repositories.base_repository import BaseRepository
from bson import ObjectId


class ReviewRepository(BaseRepository):
    """Repository for review operations"""
    
    def __init__(self, database):
        super().__init__(database, "reviews")
    
    async def get_by_vendor_id(self, vendor_id: str, skip: int = 0, limit: int = 100):
        """Get reviews by vendor ID"""
        try:
            vendor_obj_id = ObjectId(vendor_id)
            reviews = await self.find_many({"vendor_id": vendor_obj_id}, skip, limit)
        except:
            reviews = await self.find_many({"vendor_id": vendor_id}, skip, limit)
        return reviews
    
    async def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100):
        """Get reviews by user ID"""
        try:
            user_obj_id = ObjectId(user_id)
            reviews = await self.find_many({"user_id": user_obj_id}, skip, limit)
        except:
            reviews = await self.find_many({"user_id": user_id}, skip, limit)
        return reviews
    
    async def get_by_booking_id(self, booking_id: str):
        """Get review by booking ID"""
        try:
            booking_obj_id = ObjectId(booking_id)
            return await self.find_one({"booking_id": booking_obj_id})
        except:
            return await self.find_one({"booking_id": booking_id})

