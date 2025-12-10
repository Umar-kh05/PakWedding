from app.repositories.vendor_repository import VendorRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.review_repository import ReviewRepository
from bson import ObjectId
from typing import Optional


class VendorStatsService:
    
    def __init__(
        self,
        vendor_repo: VendorRepository,
        booking_repo: BookingRepository,
        review_repo: ReviewRepository
    ):
        self.vendor_repo = vendor_repo
        self.booking_repo = booking_repo
        self.review_repo = review_repo
    
    async def update_vendor_stats(self, vendor_id: str):
       
        try:
            vendor_obj_id = ObjectId(vendor_id)
        except:
            return  
        
        
        all_bookings = await self.booking_repo.get_by_vendor_id(vendor_id, 0, 10000)
        total_bookings = len(all_bookings)
        
        
        pending_bookings = [b for b in all_bookings if b.get("status") == "pending"]
        pending_requests = len(pending_bookings)
        
        
        revenue_bookings = [
            b for b in all_bookings 
            if b.get("status") in ["approved", "confirmed", "completed"]
        ]
        total_revenue = sum(b.get("total_amount", 0) for b in revenue_bookings)
        
      
        reviews = await self.review_repo.get_by_vendor_id(vendor_id, 0, 10000)
        if reviews and len(reviews) > 0:
            avg_rating = sum(r.get("rating", 0) for r in reviews) / len(reviews)
        else:
            
            vendor = await self.vendor_repo.get_by_id(vendor_id)
            avg_rating = vendor.get("rating", 0.0) if vendor else 0.0
        
        
        await self.vendor_repo.update(vendor_id, {
            "total_bookings": total_bookings,
            "pending_requests": pending_requests,
            "total_revenue": total_revenue,
            "rating": round(avg_rating, 1)
        })
    
    async def increment_pending_requests(self, vendor_id: str):
        vendor = await self.vendor_repo.get_by_id(vendor_id)
        if vendor:
            current_pending = vendor.get("pending_requests", 0)
            await self.vendor_repo.update(vendor_id, {
                "pending_requests": current_pending + 1
            })
    
    async def decrement_pending_requests(self, vendor_id: str):
        vendor = await self.vendor_repo.get_by_id(vendor_id)
        if vendor:
            current_pending = max(0, vendor.get("pending_requests", 0) - 1)
            await self.vendor_repo.update(vendor_id, {
                "pending_requests": current_pending
            })
    
    async def add_revenue(self, vendor_id: str, amount: float):
        vendor = await self.vendor_repo.get_by_id(vendor_id)
        if vendor:
            current_revenue = vendor.get("total_revenue", 0.0)
            await self.vendor_repo.update(vendor_id, {
                "total_revenue": current_revenue + amount
            })

