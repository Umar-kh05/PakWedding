"""
Authentication routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.services.user_service import UserService
from app.api.dependencies import get_user_service
from app.core.security import create_access_token
from app.core.config import settings
from app.models.user import UserCreate, UserResponse

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service)
):
    """Register a new user"""
    try:
        user = await user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_service: UserService = Depends(get_user_service)
):
    """Login and get access token"""
    # OAuth2PasswordRequestForm uses 'username' field, but we use email
    # Check if user exists first to provide better error message for unapproved admins
    user_check = await user_service.user_repo.get_by_email(form_data.username)
    if user_check:
        from app.core.security import verify_password
        # If password is correct but admin is not approved, show specific message
        if (user_check.get("role") == "admin" and 
            user_check.get("is_admin_approved") is False and
            verify_password(form_data.password, user_check["hashed_password"])):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your admin registration is pending approval. Please wait for an existing admin to approve your request.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # authenticate_user checks password, is_active status, and admin approval
    user = await user_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["_id"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["_id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }


@router.post("/check-email")
async def check_email(
    email_data: dict,
    user_service: UserService = Depends(get_user_service)
):
    """Check if email already exists"""
    email = email_data.get("email")
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is required")
        
    user = await user_service.get_user_by_email(email)
    return {"exists": user is not None}

