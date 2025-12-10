from typing import Optional, List
from pydantic import BaseModel, Field


class PackageBase(BaseModel):
    name: str
    price: float = Field(gt=0, description="Price must be greater than 0")
    description: Optional[str] = None
    features: Optional[List[str]] = []


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    features: Optional[List[str]] = None


class PackageResponse(PackageBase):
    id: str
    
    class Config:
        from_attributes = True

