"""
Favorite service - handles business logic for favorites
"""
from typing import List, Optional
from app.repositories.favorite_repository import FavoriteRepository
from app.models.favorite import FavoriteCreate, FavoriteInDB
from bson import ObjectId
from datetime import datetime


class FavoriteService:
    """Service for managing favorites"""
    
    def __init__(self, favorite_repo: FavoriteRepository):
        self.favorite_repo = favorite_repo
    
    async def create_favorite(self, user_id: str, vendor_id: str) -> dict:
        """Create a new favorite"""
        # Check if already exists
        existing = await self.favorite_repo.get_by_user_and_vendor(user_id, vendor_id)
        if existing:
            return existing
        
        favorite_dict = {
            "user_id": ObjectId(user_id),
            "vendor_id": ObjectId(vendor_id),
            "created_at": datetime.utcnow()
        }
        
        result = await self.favorite_repo.create(favorite_dict)
        result["id"] = str(result["_id"])
        del result["_id"]
        result["user_id"] = str(result["user_id"])
        result["vendor_id"] = str(result["vendor_id"])
        
        return result
    
    async def get_user_favorites(self, user_id: str, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all favorites for a user"""
        return await self.favorite_repo.get_by_user_id(user_id, skip, limit)
    
    async def is_favorite(self, user_id: str, vendor_id: str) -> bool:
        """Check if a vendor is favorited by user"""
        favorite = await self.favorite_repo.get_by_user_and_vendor(user_id, vendor_id)
        return favorite is not None
    
    async def delete_favorite(self, user_id: str, vendor_id: str) -> bool:
        """Remove a favorite"""
        return await self.favorite_repo.delete_by_user_and_vendor(user_id, vendor_id)

