"""
Booking routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.booking_service import BookingService
from app.api.dependencies import get_booking_service, get_current_user
from app.models.booking import BookingCreate, BookingUpdate, BookingResponse

router = APIRouter()


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    current_user: dict = Depends(get_current_user),
    booking_service: BookingService = Depends(get_booking_service)
):
    """Create a new booking"""
    booking = await booking_service.create_booking(booking_data)
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
    return bookings


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

