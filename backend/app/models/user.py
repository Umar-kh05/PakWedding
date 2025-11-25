"""
User domain model
Following Single Responsibility Principle - represents User entity
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    full_name: str
    phone_number: Optional[str] = None
    role: str = "user"  # user, vendor, admin


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user"""
    full_name: Optional[str] = None
    phone_number: Optional[str] = None


class UserInDB(UserBase):
    """User model as stored in database"""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserResponse(UserBase):
    """User response schema"""
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

