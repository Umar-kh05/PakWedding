from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class ChecklistCategory(str, Enum):
    VENUE = "venue"
    CATERING = "catering"
    PHOTOGRAPHY = "photography"
    DECORATION = "decoration"
    ENTERTAINMENT = "entertainment"
    ATTIRE = "attire"
    INVITATIONS = "invitations"
    TRANSPORTATION = "transportation"
    OTHER = "other"


class ChecklistItemBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    category: ChecklistCategory
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    estimated_cost: Optional[float] = Field(default=None, ge=0)


class ChecklistItemCreate(ChecklistItemBase):
    pass


class ChecklistItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[ChecklistCategory] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    estimated_cost: Optional[float] = Field(None, ge=0)
    is_completed: Optional[bool] = None


class ChecklistItemInDB(ChecklistItemBase):
    id: str = Field(alias="_id")
    user_id: str
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True


class ChecklistItemResponse(ChecklistItemBase):
    id: str
    user_id: str
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

