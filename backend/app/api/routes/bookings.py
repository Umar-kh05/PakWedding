"""
Booking routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.booking_service import BookingService
from app.api.dependencies import get_booking_service, get_current_user
from app.models.booking import BookingCreate, BookingCreateRequest, BookingUpdate, BookingResponse

router = APIRouter()


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreateRequest,
    current_user: dict = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Create a new booking"""
    # Set user_id from current user
    booking_dict = booking_data.model_dump()
    booking_dict["user_id"] = str(current_user["_id"])
    
    # Ensure vendor_id is a string
    if "vendor_id" in booking_dict:
        booking_dict["vendor_id"] = str(booking_dict["vendor_id"])
    
    # Create booking with user_id set
    from app.models.booking import BookingCreate
    booking_create = BookingCreate(**booking_dict)
    booking = await booking_service.create_booking(booking_create)
    
    # Format response
    if "_id" in booking:
        booking["id"] = str(booking["_id"])
        del booking["_id"]
    
    # Ensure all IDs are strings
    if "user_id" in booking:
        booking["user_id"] = str(booking["user_id"])
    if "vendor_id" in booking:
        booking["vendor_id"] = str(booking["vendor_id"])
    if "service_id" in booking and booking["service_id"]:
        booking["service_id"] = str(booking["service_id"])
    
    # package_name should already be in booking from BookingCreate
    return booking


@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Get current user's bookings"""
    user_id = str(current_user.get("_id") or current_user.get("id"))
    bookings = await booking_service.get_user_bookings(user_id, skip, limit)
    
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
                    try:
                        formatted_booking["created_at"] = datetime.fromisoformat(formatted_booking["created_at"].replace('Z', '+00:00'))
                    except:
                        formatted_booking["created_at"] = datetime.utcnow()
                elif not isinstance(formatted_booking["created_at"], datetime):
                    formatted_booking["created_at"] = datetime.utcnow()
            
            if "event_date" in formatted_booking:
                if isinstance(formatted_booking["event_date"], str):
                    try:
                        formatted_booking["event_date"] = datetime.fromisoformat(formatted_booking["event_date"].replace('Z', '+00:00'))
                    except:
                        pass
            
            # Ensure required fields are present
            if "status" not in formatted_booking:
                formatted_booking["status"] = "pending"
            if "created_at" not in formatted_booking:
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


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Get booking by ID"""
    booking = await booking_service.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking


@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    booking_data: BookingUpdate,
    current_user: dict = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Update booking"""
    updated_booking = await booking_service.update_booking(booking_id, booking_data)
    if not updated_booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return updated_booking


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Cancel a booking"""
    cancelled_booking = await booking_service.cancel_booking(booking_id)
    if not cancelled_booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return cancelled_booking

