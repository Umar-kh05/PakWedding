"""
User routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.services.user_service import UserService
from app.api.dependencies import get_user_service, get_current_user
from app.models.user import UserUpdate, UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update current user profile"""
    updated_user = await user_service.update_user(current_user["_id"], user_data)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated_user

