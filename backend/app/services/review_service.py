"""
Review service - business logic for review operations
"""
from typing import Optional, List
from datetime import datetime
from app.repositories.review_repository import ReviewRepository
from app.repositories.user_repository import UserRepository
from app.models.review import ReviewCreate, ReviewUpdate
from app.services.vendor_stats_service import VendorStatsService


class ReviewService:
    """Review business logic"""
    
    def __init__(
        self,
        review_repository: ReviewRepository,
        user_repository: UserRepository
    ):
        self.review_repo = review_repository
        self.user_repo = user_repository
    
    async def create_review(self, review_data: ReviewCreate, stats_service: Optional[VendorStatsService] = None) -> dict:
        """Create a new review"""
        from bson import ObjectId
        
        review_dict = review_data.model_dump()
        review_dict["created_at"] = datetime.utcnow()
        review_dict["updated_at"] = datetime.utcnow()
        
        # Convert IDs to ObjectId
        if "vendor_id" in review_dict and review_dict["vendor_id"]:
            try:
                review_dict["vendor_id"] = ObjectId(review_dict["vendor_id"])
            except:
                pass
        if "user_id" in review_dict and review_dict["user_id"]:
            try:
                review_dict["user_id"] = ObjectId(review_dict["user_id"])
            except:
                pass
        if "booking_id" in review_dict and review_dict["booking_id"]:
            try:
                review_dict["booking_id"] = ObjectId(review_dict["booking_id"])
            except:
                pass
        
        review = await self.review_repo.create(review_dict)
        
        # Update vendor rating
        if stats_service and review_dict.get("vendor_id"):
            vendor_id = str(review_dict["vendor_id"])
            await stats_service.update_vendor_stats(vendor_id)
        
        return review
    
    async def get_reviews_by_vendor(self, vendor_id: str, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all reviews for a vendor"""
        reviews = await self.review_repo.get_by_vendor_id(vendor_id, skip, limit)
        
        # Add user names to reviews
        for review in reviews:
            user_id = review.get("user_id")
            if user_id:
                user = await self.user_repo.get_by_id(str(user_id))
                if user:
                    review["user_name"] = user.get("full_name", "Anonymous")
        
        return reviews
    
    async def get_review_by_id(self, review_id: str) -> Optional[dict]:
        """Get review by ID"""
        return await self.review_repo.get_by_id(review_id)
    
    async def update_review(self, review_id: str, review_data: ReviewUpdate, stats_service: Optional[VendorStatsService] = None) -> Optional[dict]:
        """Update review"""
        update_dict = review_data.model_dump(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        
        review = await self.review_repo.update(review_id, update_dict)
        
        # Update vendor rating if rating changed
        if stats_service and review and "rating" in update_dict:
            vendor_id = str(review.get("vendor_id", ""))
            await stats_service.update_vendor_stats(vendor_id)
        
        return review

