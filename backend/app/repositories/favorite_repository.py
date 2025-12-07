"""
Favorite repository - handles Favorite data access
"""
from typing import List
from app.repositories.base_repository import BaseRepository
from bson import ObjectId


class FavoriteRepository(BaseRepository):
    """Favorite-specific repository operations"""
    
    def __init__(self, database):
        super().__init__(database, "favorites")
    
    async def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100):
        """Get all favorites for a user"""
        try:
            user_obj_id = ObjectId(user_id)
        except:
            user_obj_id = user_id
        
        cursor = self.collection.find({"user_id": user_obj_id}).sort("created_at", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        
        # Convert _id to id
        for item in items:
            if "_id" in item:
                item["id"] = str(item["_id"])
                del item["_id"]
            if "user_id" in item:
                item["user_id"] = str(item["user_id"])
            if "vendor_id" in item:
                item["vendor_id"] = str(item["vendor_id"])
        
        return items
    
    async def get_by_user_and_vendor(self, user_id: str, vendor_id: str):
        """Check if a favorite exists for user and vendor"""
        try:
            user_obj_id = ObjectId(user_id)
            vendor_obj_id = ObjectId(vendor_id)
        except:
            user_obj_id = user_id
            vendor_obj_id = vendor_id
        
        item = await self.find_one({"user_id": user_obj_id, "vendor_id": vendor_obj_id})
        if item and "_id" in item:
            item["id"] = str(item["_id"])
            del item["_id"]
        if item and "user_id" in item:
            item["user_id"] = str(item["user_id"])
        if item and "vendor_id" in item:
            item["vendor_id"] = str(item["vendor_id"])
        return item
    
    async def delete_by_user_and_vendor(self, user_id: str, vendor_id: str) -> bool:
        """Delete a favorite by user and vendor"""
        try:
            user_obj_id = ObjectId(user_id)
            vendor_obj_id = ObjectId(vendor_id)
        except:
            user_obj_id = user_id
            vendor_obj_id = vendor_id
        
        result = await self.collection.delete_one({"user_id": user_obj_id, "vendor_id": vendor_obj_id})
        return result.deleted_count > 0

