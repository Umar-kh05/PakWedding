"""
Favorite routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from pydantic import BaseModel
from app.services.favorite_service import FavoriteService
from app.api.dependencies import get_favorite_service, get_current_user, get_vendor_service
from app.models.favorite import FavoriteResponse

router = APIRouter()


class FavoriteRequest(BaseModel):
    vendor_id: str


@router.post("/", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
async def create_favorite(
    favorite_data: FavoriteRequest,
    current_user: dict = Depends(get_current_user),
    favorite_service: FavoriteService = Depends(get_favorite_service)
):
    """Add a vendor to favorites"""
    user_id = str(current_user["_id"])
    vendor_id = favorite_data.vendor_id
    favorite = await favorite_service.create_favorite(user_id, vendor_id)
    return favorite


@router.get("/", response_model=List[FavoriteResponse])
async def get_user_favorites(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    favorite_service: FavoriteService = Depends(get_favorite_service)
):
    """Get all favorites for current user"""
    user_id = str(current_user["_id"])
    favorites = await favorite_service.get_user_favorites(user_id, skip, limit)
    return favorites


@router.get("/check/{vendor_id}")
async def check_favorite(
    vendor_id: str,
    current_user: dict = Depends(get_current_user),
    favorite_service: FavoriteService = Depends(get_favorite_service)
):
    """Check if a vendor is favorited by current user"""
    user_id = str(current_user["_id"])
    is_favorite = await favorite_service.is_favorite(user_id, vendor_id)
    return {"is_favorite": is_favorite}


@router.delete("/{vendor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_favorite(
    vendor_id: str,
    current_user: dict = Depends(get_current_user),
    favorite_service: FavoriteService = Depends(get_favorite_service)
):
    """Remove a vendor from favorites"""
    user_id = str(current_user["_id"])
    deleted = await favorite_service.delete_favorite(user_id, vendor_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")
    return None

