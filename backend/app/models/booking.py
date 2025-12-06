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
    APPROVED = "approved"
    REJECTED = "rejected"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class BookingBase(BaseModel):
    """Base booking schema"""
    user_id: str
    vendor_id: str
    service_id: Optional[str] = None  # Optional - can book vendor directly
    package_name: Optional[str] = None  # Basic, Standard, Premium
    event_date: datetime
    event_location: str
    guest_count: Optional[int] = None
    special_requirements: Optional[str] = None
    total_amount: float = Field(gt=0, description="Total amount must be greater than 0")


class BookingCreateRequest(BaseModel):
    """Schema for creating a booking (user_id is set by backend)"""
    vendor_id: str
    service_id: Optional[str] = None
    package_name: Optional[str] = None  # Basic, Standard, Premium
    event_date: datetime
    event_location: str
    guest_count: Optional[int] = None
    special_requirements: Optional[str] = None
    total_amount: float = Field(gt=0, description="Total amount must be greater than 0")


class BookingCreate(BookingBase):
    """Schema for creating a booking (with user_id)"""
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
    package_name: Optional[str] = None
    
    class Config:
        from_attributes = True

