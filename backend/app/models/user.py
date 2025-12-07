"""
User domain model
Following Single Responsibility Principle - represents User entity
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_serializer
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic v2"""
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema

        def validate(value) -> ObjectId:
            if isinstance(value, ObjectId):
                return value
            if isinstance(value, str):
                if ObjectId.is_valid(value):
                    return ObjectId(value)
                raise ValueError("Invalid ObjectId string")
            raise ValueError("Invalid ObjectId")

        return core_schema.no_info_plain_validator_function(validate)


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    role: str = "user"  # user, vendor, admin


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str
    
    @classmethod
    def model_validate(cls, obj):
        if isinstance(obj, dict) and 'password' in obj:
            obj['password'] = obj['password'][:72]
        return super().model_validate(obj)


class UserUpdate(BaseModel):
    """Schema for updating user"""
    full_name: Optional[str] = None
    phone_number: Optional[str] = None


class UserInDB(UserBase):
    """User model as stored in database"""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    is_active: bool = True
    is_admin_approved: Optional[bool] = None  # None for non-admin users, False for pending admin approval, True for approved
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @field_serializer('id')
    def serialize_id(self, value: PyObjectId) -> str:
        return str(value)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class UserResponse(UserBase):
    """User response schema"""
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

