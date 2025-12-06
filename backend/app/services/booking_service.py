"""
Booking service - business logic for booking operations
Following Single Responsibility Principle
"""
from typing import Optional, List
from datetime import datetime
from app.repositories.booking_repository import BookingRepository
from app.models.booking import BookingCreate, BookingUpdate, BookingStatus


class BookingService:
    """Booking business logic"""
    
    def __init__(self, booking_repository: BookingRepository):
        self.booking_repo = booking_repository
    
    async def create_booking(self, booking_data: BookingCreate, stats_service: Optional['VendorStatsService'] = None) -> dict:
        """Create a new booking"""
        booking_dict = booking_data.model_dump()
        booking_dict["status"] = BookingStatus.PENDING
        booking_dict["created_at"] = datetime.utcnow()
        booking_dict["updated_at"] = datetime.utcnow()
        
        # Ensure vendor_id and user_id are stored as ObjectId for MongoDB
        from bson import ObjectId
        vendor_id_str = None
        if "vendor_id" in booking_dict and booking_dict["vendor_id"]:
            vendor_id_str = str(booking_dict["vendor_id"])
            try:
                booking_dict["vendor_id"] = ObjectId(booking_dict["vendor_id"])
            except:
                pass  # Keep as string if conversion fails
        if "user_id" in booking_dict and booking_dict["user_id"]:
            try:
                booking_dict["user_id"] = ObjectId(booking_dict["user_id"])
            except:
                pass  # Keep as string if conversion fails
        
        booking = await self.booking_repo.create(booking_dict)
        
        # Update vendor stats
        if stats_service and vendor_id_str:
            await stats_service.increment_pending_requests(vendor_id_str)
            await stats_service.update_vendor_stats(vendor_id_str)
        
        return booking
    
    async def get_booking_by_id(self, booking_id: str) -> Optional[dict]:
        """Get booking by ID"""
        return await self.booking_repo.get_by_id(booking_id)
    
    async def get_user_bookings(self, user_id: str, skip: int = 0, limit: int = 100):
        """Get all bookings for a user"""
        return await self.booking_repo.get_by_user_id(user_id, skip, limit)
    
    async def get_vendor_bookings(self, vendor_id: str, skip: int = 0, limit: int = 100):
        """Get all bookings for a vendor"""
        return await self.booking_repo.get_by_vendor_id(vendor_id, skip, limit)
    
    async def update_booking(self, booking_id: str, booking_data: BookingUpdate) -> Optional[dict]:
        """Update booking"""
        update_dict = booking_data.model_dump(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        return await self.booking_repo.update(booking_id, update_dict)
    
    async def cancel_booking(self, booking_id: str) -> Optional[dict]:
        """Cancel a booking"""
        return await self.booking_repo.update(booking_id, {
            "status": BookingStatus.CANCELLED,
            "updated_at": datetime.utcnow()
        })
    
    async def confirm_booking(self, booking_id: str) -> Optional[dict]:
        """Confirm a booking (vendor action)"""
        return await self.booking_repo.update(booking_id, {
            "status": BookingStatus.CONFIRMED,
            "updated_at": datetime.utcnow()
        })
    
    async def approve_booking(self, booking_id: str, stats_service: Optional['VendorStatsService'] = None) -> Optional[dict]:
        """Approve a booking (vendor action)"""
        booking = await self.booking_repo.get_by_id(booking_id)
        old_status = booking.get("status") if booking else None
        
        result = await self.booking_repo.update(booking_id, {
            "status": BookingStatus.APPROVED,
            "updated_at": datetime.utcnow()
        })
        
        # Update vendor stats
        if stats_service and booking:
            vendor_id = str(booking.get("vendor_id", ""))
            if old_status == "pending":
                await stats_service.decrement_pending_requests(vendor_id)
            await stats_service.add_revenue(vendor_id, booking.get("total_amount", 0))
            await stats_service.update_vendor_stats(vendor_id)
        
        return result
    
    async def reject_booking(self, booking_id: str, stats_service: Optional['VendorStatsService'] = None) -> Optional[dict]:
        """Reject a booking (vendor action)"""
        booking = await self.booking_repo.get_by_id(booking_id)
        old_status = booking.get("status") if booking else None
        
        result = await self.booking_repo.update(booking_id, {
            "status": BookingStatus.REJECTED,
            "updated_at": datetime.utcnow()
        })
        
        # Update vendor stats
        if stats_service and booking and old_status == "pending":
            vendor_id = str(booking.get("vendor_id", ""))
            await stats_service.decrement_pending_requests(vendor_id)
            await stats_service.update_vendor_stats(vendor_id)
        
        return result

