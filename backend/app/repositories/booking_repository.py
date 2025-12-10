from app.repositories.base_repository import BaseRepository


class BookingRepository(BaseRepository):
    
    def __init__(self, database):
        super().__init__(database, "bookings")
    
    async def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100):
        from bson import ObjectId
        try:
            user_obj_id = ObjectId(user_id)
            bookings = await self.find_many({"user_id": user_obj_id}, skip, limit)
            if bookings:
                return bookings
        except:
            pass
        
        return await self.find_many({"user_id": user_id}, skip, limit)
    
    async def get_by_vendor_id(self, vendor_id: str, skip: int = 0, limit: int = 100):
        from bson import ObjectId
        try:
            vendor_obj_id = ObjectId(vendor_id)
            bookings = await self.find_many({"vendor_id": vendor_obj_id}, skip, limit)
            if bookings:
                return bookings
        except:
            pass
        
        return await self.find_many({"vendor_id": vendor_id}, skip, limit)
    
    async def get_by_status(self, status: str, skip: int = 0, limit: int = 100):
        return await self.find_many({"status": status}, skip, limit)

