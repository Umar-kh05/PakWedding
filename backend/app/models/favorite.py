from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId


class FavoriteBase(BaseModel):
    user_id: str
    vendor_id: str


class FavoriteCreate(FavoriteBase):
    pass


class FavoriteInDB(FavoriteBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "60c72b2f9b1e8b001c8e4a1d",
                "user_id": "60c72b2f9b1e8b001c8e4a1c",
                "vendor_id": "60c72b2f9b1e8b001c8e4a1e",
                "created_at": "2025-05-15T10:00:00Z"
            }
        }


class FavoriteResponse(FavoriteInDB):
    class Config:
        from_attributes = True

