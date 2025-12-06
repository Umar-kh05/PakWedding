"""
Vendor booking management routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.services.booking_service import BookingService
from app.services.vendor_service import VendorService
from app.api.dependencies import get_booking_service, get_current_vendor, get_vendor_service, get_vendor_stats_service
from app.models.booking import BookingResponse

router = APIRouter()


@router.get("/bookings", response_model=List[BookingResponse])
async def get_vendor_bookings(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: dict = Depends(get_current_vendor),
    booking_service: BookingService = Depends(get_booking_service),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get all bookings for current vendor"""
    try:
        # Get vendor ID from user_id
        from bson import ObjectId
        
        # Try to get vendor - handle both ObjectId and string formats
        user_id = current_user.get("_id") or current_user.get("id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="User ID not found in authentication token"
            )
        
        # Try both ObjectId and string formats
        vendor = await vendor_service.vendor_repo.get_by_user_id(str(user_id))
        
        # If not found, try with ObjectId
        if not vendor:
            try:
                obj_id = ObjectId(user_id)
                vendor = await vendor_service.vendor_repo.find_one({"user_id": obj_id})
            except Exception as e:
                print(f"Error converting user_id to ObjectId: {e}")
        
        # If still not found, try direct string lookup
        if not vendor:
            vendor = await vendor_service.vendor_repo.find_one({"user_id": str(user_id)})
        
        if not vendor:
            # Log for debugging
            print(f"Vendor lookup failed for user_id: {user_id} (type: {type(user_id)})")
            print(f"Current user: {current_user}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Vendor profile not found. Please ensure you have registered as a vendor."
            )
        
        vendor_id = str(vendor["_id"])
        
        # Use the booking service method which handles both ObjectId and string
        if status_filter:
            bookings = await booking_service.get_vendor_bookings(vendor_id, skip, limit)
            # Filter by status
            bookings = [b for b in bookings if b.get("status") == status_filter]
        else:
            bookings = await booking_service.get_vendor_bookings(vendor_id, skip, limit)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error in get_vendor_bookings: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve bookings: {str(e)}"
        )
    
    # Format bookings for response
    formatted_bookings = []
    for booking in bookings:
        try:
            # Create a copy to avoid modifying the original
            formatted_booking = booking.copy()
            
            # Convert _id to id
            if "_id" in formatted_booking:
                formatted_booking["id"] = str(formatted_booking["_id"])
                del formatted_booking["_id"]
            
            # Ensure all IDs are strings
            if "user_id" in formatted_booking:
                formatted_booking["user_id"] = str(formatted_booking["user_id"])
            if "vendor_id" in formatted_booking:
                formatted_booking["vendor_id"] = str(formatted_booking["vendor_id"])
            if "service_id" in formatted_booking and formatted_booking["service_id"]:
                formatted_booking["service_id"] = str(formatted_booking["service_id"])
            
            # Ensure dates are datetime objects (BookingResponse expects datetime, not string)
            from datetime import datetime
            if "created_at" in formatted_booking:
                if isinstance(formatted_booking["created_at"], str):
                    # Parse ISO string to datetime
                    try:
                        formatted_booking["created_at"] = datetime.fromisoformat(formatted_booking["created_at"].replace('Z', '+00:00'))
                    except:
                        formatted_booking["created_at"] = datetime.utcnow()
                # If it's already a datetime, keep it
                elif not isinstance(formatted_booking["created_at"], datetime):
                    formatted_booking["created_at"] = datetime.utcnow()
            
            if "event_date" in formatted_booking:
                if isinstance(formatted_booking["event_date"], str):
                    # Parse ISO string to datetime
                    try:
                        formatted_booking["event_date"] = datetime.fromisoformat(formatted_booking["event_date"].replace('Z', '+00:00'))
                    except:
                        # If parsing fails, try to keep original or set to now
                        pass
                # If it's already a datetime, keep it
            
            # Ensure required fields are present
            if "status" not in formatted_booking:
                formatted_booking["status"] = "pending"
            if "created_at" not in formatted_booking:
                from datetime import datetime
                formatted_booking["created_at"] = datetime.utcnow()
            
            # Remove any fields not in BookingResponse
            allowed_fields = {
                "id", "user_id", "vendor_id", "service_id", "package_name", "event_date", 
                "event_location", "guest_count", "special_requirements", 
                "total_amount", "status", "created_at"
            }
            formatted_booking = {k: v for k, v in formatted_booking.items() if k in allowed_fields}
            
            formatted_bookings.append(formatted_booking)
        except Exception as e:
            # Log error but continue processing other bookings
            import traceback
            print(f"Error formatting booking {booking.get('_id', 'unknown')}: {e}")
            print(traceback.format_exc())
            continue
    
    return formatted_bookings


@router.post("/bookings/{booking_id}/approve", response_model=BookingResponse)
async def approve_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_vendor),
    booking_service: BookingService = Depends(get_booking_service),
    vendor_service: VendorService = Depends(get_vendor_service),
    stats_service = Depends(get_vendor_stats_service)
):
    """Approve a booking (vendor only)"""
    try:
        # Verify booking belongs to vendor
        booking = await booking_service.get_booking_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
        # Get vendor ID
        from bson import ObjectId
        user_id = current_user.get("_id") or current_user.get("id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User ID not found in authentication token"
            )
        
        vendor = await vendor_service.vendor_repo.get_by_user_id(str(user_id))
        
        if not vendor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
        
        vendor_id = str(vendor["_id"])
        booking_vendor_id = str(booking.get("vendor_id"))
        
        if booking_vendor_id != vendor_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only approve your own bookings")
        
        approved_booking = await booking_service.approve_booking(booking_id, stats_service)
        if not approved_booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
        # Format response for BookingResponse model
        if "_id" in approved_booking:
            approved_booking["id"] = str(approved_booking["_id"])
            del approved_booking["_id"]
        
        # Ensure all IDs are strings
        if "user_id" in approved_booking:
            approved_booking["user_id"] = str(approved_booking["user_id"])
        if "vendor_id" in approved_booking:
            approved_booking["vendor_id"] = str(approved_booking["vendor_id"])
        if "service_id" in approved_booking and approved_booking["service_id"]:
            approved_booking["service_id"] = str(approved_booking["service_id"])
        
        # Ensure dates are datetime objects
        from datetime import datetime
        if "created_at" in approved_booking:
            if isinstance(approved_booking["created_at"], str):
                try:
                    approved_booking["created_at"] = datetime.fromisoformat(approved_booking["created_at"].replace('Z', '+00:00'))
                except:
                    approved_booking["created_at"] = datetime.utcnow()
            elif not isinstance(approved_booking["created_at"], datetime):
                approved_booking["created_at"] = datetime.utcnow()
        
        if "event_date" in approved_booking:
            if isinstance(approved_booking["event_date"], str):
                try:
                    approved_booking["event_date"] = datetime.fromisoformat(approved_booking["event_date"].replace('Z', '+00:00'))
                except:
                    pass
        
        # Remove fields not in BookingResponse
        allowed_fields = {
            "id", "user_id", "vendor_id", "service_id", "event_date", 
            "event_location", "guest_count", "special_requirements", 
            "total_amount", "status", "created_at"
        }
        approved_booking = {k: v for k, v in approved_booking.items() if k in allowed_fields}
        
        return approved_booking
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"[ERROR] Error approving booking {booking_id}: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to approve booking: {str(e)}"
        )


@router.post("/bookings/{booking_id}/reject", response_model=BookingResponse)
async def reject_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_vendor),
    booking_service: BookingService = Depends(get_booking_service),
    vendor_service: VendorService = Depends(get_vendor_service),
    stats_service = Depends(get_vendor_stats_service)
):
    """Reject a booking (vendor only)"""
    try:
        # Verify booking belongs to vendor
        booking = await booking_service.get_booking_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
        # Get vendor ID
        from bson import ObjectId
        user_id = current_user.get("_id") or current_user.get("id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User ID not found in authentication token"
            )
        
        vendor = await vendor_service.vendor_repo.get_by_user_id(str(user_id))
        
        if not vendor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
        
        vendor_id = str(vendor["_id"])
        booking_vendor_id = str(booking.get("vendor_id"))
        
        if booking_vendor_id != vendor_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only reject your own bookings")
        
        rejected_booking = await booking_service.reject_booking(booking_id, stats_service)
        if not rejected_booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
        # Format response for BookingResponse model
        if "_id" in rejected_booking:
            rejected_booking["id"] = str(rejected_booking["_id"])
            del rejected_booking["_id"]
        
        # Ensure all IDs are strings
        if "user_id" in rejected_booking:
            rejected_booking["user_id"] = str(rejected_booking["user_id"])
        if "vendor_id" in rejected_booking:
            rejected_booking["vendor_id"] = str(rejected_booking["vendor_id"])
        if "service_id" in rejected_booking and rejected_booking["service_id"]:
            rejected_booking["service_id"] = str(rejected_booking["service_id"])
        
        # Ensure dates are datetime objects
        from datetime import datetime
        if "created_at" in rejected_booking:
            if isinstance(rejected_booking["created_at"], str):
                try:
                    rejected_booking["created_at"] = datetime.fromisoformat(rejected_booking["created_at"].replace('Z', '+00:00'))
                except:
                    rejected_booking["created_at"] = datetime.utcnow()
            elif not isinstance(rejected_booking["created_at"], datetime):
                rejected_booking["created_at"] = datetime.utcnow()
        
        if "event_date" in rejected_booking:
            if isinstance(rejected_booking["event_date"], str):
                try:
                    rejected_booking["event_date"] = datetime.fromisoformat(rejected_booking["event_date"].replace('Z', '+00:00'))
                except:
                    pass
        
        # Remove fields not in BookingResponse
        allowed_fields = {
            "id", "user_id", "vendor_id", "service_id", "event_date", 
            "event_location", "guest_count", "special_requirements", 
            "total_amount", "status", "created_at"
        }
        rejected_booking = {k: v for k, v in rejected_booking.items() if k in allowed_fields}
        
        return rejected_booking
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"[ERROR] Error rejecting booking {booking_id}: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reject booking: {str(e)}"
        )

