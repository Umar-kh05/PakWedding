"""
Booking domain model
Following Single Responsibility Principle
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class BookingStatus(str, Enum):
    """Booking status enumeration"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class BookingBase(BaseModel):
    """Base booking schema"""
    user_id: str
    vendor_id: str
    service_id: str
    event_date: datetime
    event_location: str
    guest_count: Optional[int] = None
    special_requirements: Optional[str] = None
    total_amount: float


class BookingCreate(BookingBase):
    """Schema for creating a booking"""
    pass


class BookingUpdate(BaseModel):
    """Schema for updating booking"""
    event_date: Optional[datetime] = None
    event_location: Optional[str] = None
    guest_count: Optional[int] = None
    special_requirements: Optional[str] = None
    status: Optional[BookingStatus] = None


class BookingInDB(BookingBase):
    """Booking model as stored in database"""
    id: str = Field(alias="_id")
    status: BookingStatus = BookingStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class BookingResponse(BookingBase):
    """Booking response schema"""
    id: str
    status: BookingStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

