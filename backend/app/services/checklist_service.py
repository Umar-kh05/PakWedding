"""
Checklist service - handles business logic for checklist items
"""
from typing import List, Optional
from app.repositories.checklist_repository import ChecklistRepository
from app.models.checklist import ChecklistItemCreate, ChecklistItemUpdate, ChecklistItemResponse
from bson import ObjectId
from datetime import datetime


class ChecklistService:
    """Service for managing checklist items"""
    
    def __init__(self, checklist_repo: ChecklistRepository):
        self.checklist_repo = checklist_repo
    
    async def create_checklist_item(self, user_id: str, item_data: ChecklistItemCreate) -> dict:
        """Create a new checklist item"""
        item_dict = item_data.model_dump()
        item_dict["user_id"] = ObjectId(user_id)
        item_dict["is_completed"] = False
        item_dict["created_at"] = datetime.utcnow()
        item_dict["updated_at"] = datetime.utcnow()
        
        result = await self.checklist_repo.create(item_dict)
        result["id"] = str(result["_id"])
        del result["_id"]
        result["user_id"] = str(result["user_id"])
        
        return result
    
    async def get_user_checklist_items(self, user_id: str, category: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all checklist items for a user, optionally filtered by category"""
        if category:
            return await self.checklist_repo.get_by_category(user_id, category, skip, limit)
        return await self.checklist_repo.get_by_user_id(user_id, skip, limit)
    
    async def get_checklist_item_by_id(self, item_id: str, user_id: str) -> Optional[dict]:
        """Get a specific checklist item by ID"""
        try:
            item = await self.checklist_repo.find_one({"_id": ObjectId(item_id), "user_id": ObjectId(user_id)})
            if item:
                item["id"] = str(item["_id"])
                del item["_id"]
                item["user_id"] = str(item["user_id"])
            return item
        except:
            return None
    
    async def update_checklist_item(self, item_id: str, user_id: str, item_data: ChecklistItemUpdate) -> Optional[dict]:
        """Update a checklist item"""
        update_dict = item_data.model_dump(exclude_unset=True)
        
        # If marking as completed, set completed_at
        if update_dict.get("is_completed") is True:
            update_dict["completed_at"] = datetime.utcnow()
        elif update_dict.get("is_completed") is False:
            update_dict["completed_at"] = None
        
        update_dict["updated_at"] = datetime.utcnow()
        
        # Use find_one_and_update to get the updated document
        result = await self.checklist_repo.collection.find_one_and_update(
            {"_id": ObjectId(item_id), "user_id": ObjectId(user_id)},
            {"$set": update_dict},
            return_document=True  # Return the updated document
        )
        
        if result:
            result["id"] = str(result["_id"])
            del result["_id"]
            result["user_id"] = str(result["user_id"])
        
        return result
    
    async def delete_checklist_item(self, item_id: str, user_id: str) -> bool:
        """Delete a checklist item"""
        try:
            result = await self.checklist_repo.collection.delete_one(
                {"_id": ObjectId(item_id), "user_id": ObjectId(user_id)}
            )
            return result.deleted_count > 0
        except:
            return False
    
    async def get_checklist_stats(self, user_id: str) -> dict:
        """Get checklist statistics for a user"""
        total = await self.checklist_repo.get_total_count(user_id)
        completed = await self.checklist_repo.get_completed_count(user_id)
        
        return {
            "total": total,
            "completed": completed,
            "remaining": total - completed,
            "completion_percentage": round((completed / total * 100) if total > 0 else 0, 1)
        }

