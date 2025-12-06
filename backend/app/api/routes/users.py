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


@router.put("/me/password", response_model=UserResponse)
async def update_password(
    password_data: dict,
    current_user: dict = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update user password"""
    from app.core.security import verify_password, hash_password
    
    old_password = password_data.get("old_password")
    new_password = password_data.get("new_password")
    
    if not old_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both old_password and new_password are required"
        )
    
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    
    # Verify old password
    user = await user_service.user_repo.get_by_id(current_user["_id"])
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if not verify_password(old_password, user.get("hashed_password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect old password"
        )
    
    # Update password
    updated_user = await user_service.user_repo.update(
        current_user["_id"],
        {"hashed_password": hash_password(new_password)}
    )
    
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Format response
    if "_id" in updated_user:
        updated_user["id"] = str(updated_user["_id"])
        del updated_user["_id"]
    
    updated_user.pop("hashed_password", None)
    
    return updated_user
