"""
Authentication routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from app.services.user_service import UserService
from app.api.dependencies import get_user_service
from app.core.security import create_access_token
from app.core.config import settings
from app.models.user import UserCreate, UserResponse
from app.services.email_service import email_service
from pydantic import BaseModel, EmailStr
from app.core.password_validator import validate_password_strength, get_password_requirements
import secrets
import logging

logger = logging.getLogger(__name__)
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
    
    # Normalize email to lowercase for case-insensitive comparison
    email = email.lower().strip()
    
    logger.info(f"[CHECK EMAIL] Checking email: {email}")
    
    # Use direct database query to avoid any caching or service layer issues
    from app.core.database import Database
    db = Database.get_database()
    
    # Check in users collection
    user = await db["users"].find_one({"email": email})
    exists = user is not None
    
    logger.info(f"[CHECK EMAIL] Result: exists={exists}")
    
    return {"exists": exists}


@router.post("/check-password-strength")
async def check_password_strength(password_data: dict):
    """Check password strength"""
    password = password_data.get("password", "")
    
    if not password:
        return {
            "strength": "weak",
            "issues": ["Password cannot be empty"],
            "is_valid": False,
            "requirements": get_password_requirements()
        }
    
    strength, issues, is_valid = validate_password_strength(password)
    
    return {
        "strength": strength,
        "issues": issues,
        "is_valid": is_valid,
        "requirements": get_password_requirements()
    }


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    user_service: UserService = Depends(get_user_service)
):
    """Send password reset email"""
    try:
        logger.info(f"[FORGOT PASSWORD] Request received for email: {request.email}")
        user = await user_service.get_user_by_email(request.email)
        
        if user:
            logger.info(f"[FORGOT PASSWORD] User found: {user.get('email')}")
            # Generate reset token
            reset_token = secrets.token_urlsafe(32)
            logger.info(f"[FORGOT PASSWORD] Generated token: {reset_token[:20]}...")
            
            # Store token with expiry (30 minutes from now)
            reset_expiry = datetime.utcnow() + timedelta(minutes=30)
            
            # Update user with reset token - use email instead of _id for reliability
            result = await user_service.user_repo.collection.update_one(
                {"email": user["email"]},
                {
                    "$set": {
                        "reset_token": reset_token,
                        "reset_token_expiry": reset_expiry
                    }
                }
            )
            logger.info(f"[FORGOT PASSWORD] Update result - matched: {result.matched_count}, modified: {result.modified_count}")
            
            # Send email
            logger.info(f"[FORGOT PASSWORD] Attempting to send email to: {request.email}")
            email_sent = await email_service.send_password_reset_email(
                to_email=request.email,
                reset_token=reset_token,
                user_name=user.get("full_name")
            )
            logger.info(f"[FORGOT PASSWORD] Email sent result: {email_sent}")
        else:
            logger.info(f"[FORGOT PASSWORD] No user found with email: {request.email}")
        
        # Always return success to prevent email enumeration
        return {"message": "If an account exists with this email, a password reset link has been sent"}
    
    except Exception as e:
        print(f"[FORGOT PASSWORD] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process password reset request"
        )


@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    user_service: UserService = Depends(get_user_service)
):
    """Reset password using token"""
    try:
        # Find user with this reset token
        user = await user_service.user_repo.collection.find_one({
            "reset_token": request.token
        })
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Check if token is expired
        if user.get("reset_token_expiry"):
            if datetime.utcnow() > user["reset_token_expiry"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Reset token has expired. Please request a new one"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
        # Validate password strength
        from app.core.password_validator import validate_password_strength
        strength, issues, is_valid = validate_password_strength(request.new_password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Password is too weak: {', '.join(issues)}"
            )
        
        # Check if new password is same as old password
        from app.core.security import hash_password, verify_password
        old_hashed_password = user.get("hashed_password")
        if old_hashed_password and verify_password(request.new_password, old_hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password cannot be the same as your previous password"
            )
        
        # Hash new password
        hashed_password = hash_password(request.new_password)
        
        # Update password and clear reset token
        logger.info(f"[RESET PASSWORD] Resetting password for user: {user.get('email')}")
        result = await user_service.user_repo.collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {"hashed_password": hashed_password},
                "$unset": {"reset_token": "", "reset_token_expiry": ""}
            }
        )
        logger.info(f"[RESET PASSWORD] Password updated - matched: {result.matched_count}, modified: {result.modified_count}")
        
        return {"message": "Password has been reset successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in reset_password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset password"
        )

