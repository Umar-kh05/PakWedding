from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    vendor_id: str
    name: str
    description: str
    category: str
    price: float
    duration: Optional[str] = None
    features: List[str] = []


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    features: Optional[List[str]] = None


class ServiceInDB(ServiceBase):
    id: str = Field(alias="_id")
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class ServiceResponse(ServiceBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

