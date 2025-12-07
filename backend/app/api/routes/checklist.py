"""
Checklist routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.services.checklist_service import ChecklistService
from app.api.dependencies import get_checklist_service, get_current_user
from app.models.checklist import ChecklistItemCreate, ChecklistItemUpdate, ChecklistItemResponse

router = APIRouter()


@router.post("/", response_model=ChecklistItemResponse, status_code=status.HTTP_201_CREATED)
async def create_checklist_item(
    item_data: ChecklistItemCreate,
    current_user: dict = Depends(get_current_user),
    checklist_service: ChecklistService = Depends(get_checklist_service)
):
    """Create a new checklist item"""
    user_id = str(current_user["_id"])
    item = await checklist_service.create_checklist_item(user_id, item_data)
    return item


@router.get("/", response_model=List[ChecklistItemResponse])
async def get_checklist_items(
    category: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    checklist_service: ChecklistService = Depends(get_checklist_service)
):
    """Get all checklist items for current user"""
    user_id = str(current_user["_id"])
    items = await checklist_service.get_user_checklist_items(user_id, category, skip, limit)
    return items


@router.get("/stats")
async def get_checklist_stats(
    current_user: dict = Depends(get_current_user),
    checklist_service: ChecklistService = Depends(get_checklist_service)
):
    """Get checklist statistics for current user"""
    user_id = str(current_user["_id"])
    stats = await checklist_service.get_checklist_stats(user_id)
    return stats


@router.get("/{item_id}", response_model=ChecklistItemResponse)
async def get_checklist_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    checklist_service: ChecklistService = Depends(get_checklist_service)
):
    """Get a specific checklist item"""
    user_id = str(current_user["_id"])
    item = await checklist_service.get_checklist_item_by_id(item_id, user_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")
    return item


@router.put("/{item_id}", response_model=ChecklistItemResponse)
async def update_checklist_item(
    item_id: str,
    item_data: ChecklistItemUpdate,
    current_user: dict = Depends(get_current_user),
    checklist_service: ChecklistService = Depends(get_checklist_service)
):
    """Update a checklist item"""
    user_id = str(current_user["_id"])
    item = await checklist_service.update_checklist_item(item_id, user_id, item_data)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_checklist_item(
    item_id: str,
    current_user: dict = Depends(get_current_user),
    checklist_service: ChecklistService = Depends(get_checklist_service)
):
    """Delete a checklist item"""
    user_id = str(current_user["_id"])
    success = await checklist_service.delete_checklist_item(item_id, user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")
    return None

