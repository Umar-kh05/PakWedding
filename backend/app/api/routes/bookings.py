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
    
    return booking


@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Get current user's bookings"""
    bookings = await booking_service.get_user_bookings(current_user["_id"], skip, limit)
    
    # Format bookings for response
    formatted_bookings = []
    for booking in bookings:
        if "_id" in booking:
            booking["id"] = str(booking["_id"])
            del booking["_id"]
        formatted_bookings.append(booking)
    
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

