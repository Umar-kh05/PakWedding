"""
Review service - business logic for review operations
"""
from typing import Optional, List
from datetime import datetime
from app.repositories.review_repository import ReviewRepository
from app.repositories.user_repository import UserRepository
from app.repositories.booking_repository import BookingRepository
from app.models.review import ReviewCreate, ReviewUpdate, ReviewBase
from app.services.vendor_stats_service import VendorStatsService


class ReviewService:
    """Review business logic"""
    
    def __init__(
        self,
        review_repository: ReviewRepository,
        user_repository: UserRepository,
        booking_repository: Optional[BookingRepository] = None
    ):
        self.review_repo = review_repository
        self.user_repo = user_repository
        self.booking_repo = booking_repository
    
    async def create_review(self, review_data: ReviewBase, stats_service: Optional[VendorStatsService] = None) -> dict:
        """Create a new review - validates that user has a booking with the vendor"""
        from bson import ObjectId
        
        review_dict = review_data.model_dump()
        
        # Validate booking exists and belongs to user
        if self.booking_repo and review_dict.get("booking_id"):
            booking_id = review_dict["booking_id"]
            booking = await self.booking_repo.get_by_id(booking_id)
            
            if not booking:
                raise ValueError("Booking not found")
            
            # Check if booking belongs to the user
            booking_user_id = str(booking.get("user_id", ""))
            review_user_id = str(review_dict.get("user_id", ""))
            
            if booking_user_id != review_user_id:
                raise ValueError("You can only review vendors you have booked")
            
            # Check if booking is approved or completed
            booking_status = booking.get("status", "").lower()
            if booking_status not in ["approved", "confirmed", "completed"]:
                raise ValueError("You can only review approved or completed bookings")
            
            # Check if review already exists for this booking
            existing_review = await self.review_repo.get_by_booking_id(booking_id)
            if existing_review:
                raise ValueError("You have already reviewed this booking")
            
            # Verify vendor_id matches booking and use booking's vendor_id (more reliable)
            booking_vendor_id = booking.get("vendor_id", "")
            review_vendor_id = review_dict.get("vendor_id", "")
            
            # Convert both to strings for comparison
            booking_vendor_id_str = str(booking_vendor_id)
            review_vendor_id_str = str(review_vendor_id)
            
            print(f"[DEBUG CREATE REVIEW] Booking vendor_id: {booking_vendor_id} (type: {type(booking_vendor_id)})")
            print(f"[DEBUG CREATE REVIEW] Review vendor_id: {review_vendor_id} (type: {type(review_vendor_id)})")
            
            if booking_vendor_id_str != review_vendor_id_str:
                raise ValueError("Vendor ID does not match the booking")
            
            # Use booking's vendor_id to ensure consistency
            review_dict["vendor_id"] = booking_vendor_id
            print(f"[DEBUG CREATE REVIEW] Using booking's vendor_id: {review_dict['vendor_id']} (type: {type(review_dict['vendor_id'])})")
        elif self.booking_repo:
            # If no booking_id provided, check if user has any booking with vendor
            user_id = str(review_dict.get("user_id", ""))
            vendor_id = str(review_dict.get("vendor_id", ""))
            
            user_bookings = await self.booking_repo.get_by_user_id(user_id, 0, 1000)
            has_booking = any(
                str(b.get("vendor_id", "")) == vendor_id and 
                b.get("status", "").lower() in ["approved", "confirmed", "completed"]
                for b in user_bookings
            )
            
            if not has_booking:
                raise ValueError("You can only review vendors you have booked")
        
        review_dict["created_at"] = datetime.utcnow()
        review_dict["updated_at"] = datetime.utcnow()
        
        # Convert IDs to ObjectId
        if "vendor_id" in review_dict and review_dict["vendor_id"]:
            try:
                vendor_id_before = review_dict["vendor_id"]
                review_dict["vendor_id"] = ObjectId(review_dict["vendor_id"])
                print(f"[DEBUG CREATE REVIEW] Converted vendor_id to ObjectId: {vendor_id_before} -> {review_dict['vendor_id']}")
            except Exception as e:
                print(f"[DEBUG CREATE REVIEW] Failed to convert vendor_id to ObjectId: {e}, keeping as: {review_dict['vendor_id']}")
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
    
    async def get_reviews_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all reviews made by a user"""
        reviews = await self.review_repo.get_by_user_id(user_id, skip, limit)
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
    
    async def delete_review(self, review_id: str, stats_service: Optional[VendorStatsService] = None) -> bool:
        """Delete a review"""
        # Get review before deleting to update stats
        review = await self.review_repo.get_by_id(review_id)
        if not review:
            return False
        
        vendor_id = str(review.get("vendor_id", ""))
        
        # Delete review
        deleted = await self.review_repo.delete(review_id)
        
        # Update vendor stats after deletion
        if deleted and stats_service and vendor_id:
            await stats_service.update_vendor_stats(vendor_id)
        
        return deleted
    
    async def get_all_reviews(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all reviews (admin only)"""
        return await self.review_repo.find_many({}, skip, limit)

