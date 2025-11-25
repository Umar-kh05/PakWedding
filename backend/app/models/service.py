"""
Service domain model
Following Single Responsibility Principle
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    """Base service schema"""
    vendor_id: str
    name: str
    description: str
    category: str
    price: float
    duration: Optional[str] = None  # e.g., "4 hours", "Full day"
    features: List[str] = []


class ServiceCreate(ServiceBase):
    """Schema for creating a service"""
    pass


class ServiceUpdate(BaseModel):
    """Schema for updating service"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    features: Optional[List[str]] = None


class ServiceInDB(ServiceBase):
    """Service model as stored in database"""
    id: str = Field(alias="_id")
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class ServiceResponse(ServiceBase):
    """Service response schema"""
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

