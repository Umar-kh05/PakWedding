"""
Review domain model
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ReviewBase(BaseModel):
    """Base review schema"""
    user_id: str
    vendor_id: str
    booking_id: Optional[str] = None
    rating: float = Field(ge=1, le=5, description="Rating must be between 1 and 5")
    comment: Optional[str] = None


class ReviewCreate(BaseModel):
    """Schema for creating a review (user_id is set by backend from current user)"""
    vendor_id: str
    booking_id: Optional[str] = None
    rating: float = Field(ge=1, le=5, description="Rating must be between 1 and 5")
    comment: Optional[str] = None


class ReviewUpdate(BaseModel):
    """Schema for updating a review"""
    rating: Optional[float] = Field(None, ge=1, le=5)
    comment: Optional[str] = None


class ReviewInDB(ReviewBase):
    """Review model as stored in database"""
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class ReviewResponse(ReviewBase):
    """Review response schema"""
    id: str
    created_at: datetime
    user_name: Optional[str] = None
    
    class Config:
        from_attributes = True

