from app.repositories.base_repository import BaseRepository
from bson import ObjectId


class ReviewRepository(BaseRepository):
    
    def __init__(self, database):
        super().__init__(database, "reviews")
    
    async def get_by_vendor_id(self, vendor_id: str, skip: int = 0, limit: int = 100):
        reviews = []
        
        try:
            vendor_obj_id = ObjectId(vendor_id)
            reviews = await self.find_many({"vendor_id": vendor_obj_id}, skip, limit)
            if reviews:
                return reviews
        except Exception as e:
            print(f"[DEBUG] ObjectId query failed for vendor_id {vendor_id}: {e}")
        
        try:
            reviews = await self.find_many({"vendor_id": vendor_id}, skip, limit)
            if reviews:
                return reviews
        except Exception as e:
            print(f"[DEBUG] String query failed for vendor_id {vendor_id}: {e}")
        
        try:
            vendor_obj_id = ObjectId(vendor_id)
            cursor = self.collection.find({"vendor_id": vendor_obj_id}).skip(skip).limit(limit)
            reviews_list = await cursor.to_list(length=limit)
            for review in reviews_list:
                if "_id" in review:
                    review["_id"] = str(review["_id"])
            if reviews_list:
                return reviews_list
        except Exception as e:
            print(f"[DEBUG] Direct MongoDB ObjectId query failed: {e}")
        
        try:
            cursor = self.collection.find({"vendor_id": vendor_id}).skip(skip).limit(limit)
            reviews_list = await cursor.to_list(length=limit)
            for review in reviews_list:
                if "_id" in review:
                    review["_id"] = str(review["_id"])
            return reviews_list
        except Exception as e:
            print(f"[DEBUG] Direct MongoDB string query failed: {e}")
        
        return []
    
    async def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100):
        try:
            user_obj_id = ObjectId(user_id)
            reviews = await self.find_many({"user_id": user_obj_id}, skip, limit)
        except:
            reviews = await self.find_many({"user_id": user_id}, skip, limit)
        return reviews
    
    async def get_by_booking_id(self, booking_id: str):
        try:
            booking_obj_id = ObjectId(booking_id)
            return await self.find_one({"booking_id": booking_obj_id})
        except:
            return await self.find_one({"booking_id": booking_id})

