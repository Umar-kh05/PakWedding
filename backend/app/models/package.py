"""
Package domain model for vendor pricing packages
Following Single Responsibility Principle
"""
from typing import Optional, List
from pydantic import BaseModel, Field


class PackageBase(BaseModel):
    """Base package schema"""
    name: str  # Basic, Standard, Premium
    price: float = Field(gt=0, description="Price must be greater than 0")
    description: Optional[str] = None
    features: Optional[List[str]] = []


class PackageCreate(PackageBase):
    """Schema for creating a package"""
    pass


class PackageUpdate(BaseModel):
    """Schema for updating a package"""
    name: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    features: Optional[List[str]] = None


class PackageResponse(PackageBase):
    """Package response schema"""
    id: str
    
    class Config:
        from_attributes = True

