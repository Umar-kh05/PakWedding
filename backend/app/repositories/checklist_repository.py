from typing import List, Optional
from app.repositories.base_repository import BaseRepository
from bson import ObjectId


class ChecklistRepository(BaseRepository):
    
    def __init__(self, database):
        super().__init__(database, "checklists")
    
    async def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100):
        try:
            user_obj_id = ObjectId(user_id)
        except:
            user_obj_id = user_id
        
        cursor = self.collection.find({"user_id": user_obj_id}).sort("created_at", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        
        for item in items:
            if "_id" in item:
                item["id"] = str(item["_id"])
                del item["_id"]
            if "user_id" in item:
                item["user_id"] = str(item["user_id"])
        
        return items
    
    async def get_by_category(self, user_id: str, category: str, skip: int = 0, limit: int = 100):
        try:
            user_obj_id = ObjectId(user_id)
        except:
            user_obj_id = user_id
        
        cursor = self.collection.find({"user_id": user_obj_id, "category": category}).sort("created_at", -1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        
        for item in items:
            if "_id" in item:
                item["id"] = str(item["_id"])
                del item["_id"]
            if "user_id" in item:
                item["user_id"] = str(item["user_id"])
        
        return items
    
    async def get_completed_count(self, user_id: str) -> int:
        try:
            user_obj_id = ObjectId(user_id)
        except:
            user_obj_id = user_id
        
        count = await self.collection.count_documents({"user_id": user_obj_id, "is_completed": True})
        return count
    
    async def get_total_count(self, user_id: str) -> int:
        try:
            user_obj_id = ObjectId(user_id)
        except:
            user_obj_id = user_id
        
        count = await self.collection.count_documents({"user_id": user_obj_id})
        return count

