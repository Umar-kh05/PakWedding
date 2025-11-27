"""
Vendor domain model
Following Single Responsibility Principle
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId


class VendorBase(BaseModel):
    """Base vendor schema"""
    business_name: str
    contact_person: str
    email: str
    phone_number: str
    business_address: str
    service_category: str  # photographer, caterer, venue, decorator, etc.
    description: Optional[str] = None
    rating: float = 0.0
    total_bookings: int = 0
    image_url: Optional[str] = None  # Main vendor image
    gallery_images: Optional[List[str]] = []  # Gallery images


class VendorCreate(VendorBase):
    """Schema for vendor registration"""
    password: str


class VendorUpdate(BaseModel):
    """Schema for updating vendor"""
    business_name: Optional[str] = None
    contact_person: Optional[str] = None
    phone_number: Optional[str] = None
    business_address: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None


class VendorInDB(VendorBase):
    """Vendor model as stored in database"""
    id: str = Field(alias="_id")
    user_id: str  # Reference to User collection
    is_approved: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class VendorResponse(VendorBase):
    """Vendor response schema"""
    id: str
    is_approved: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

