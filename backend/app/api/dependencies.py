"""
API dependencies - dependency injection
Following Dependency Inversion Principle
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.database import get_db
from app.core.security import TokenGenerator
from app.repositories.user_repository import UserRepository
from app.repositories.vendor_repository import VendorRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.service_repository import ServiceRepository
from app.services.user_service import UserService
from app.services.vendor_service import VendorService
from app.services.booking_service import BookingService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# Repository dependencies
async def get_user_repository(db = Depends(get_db)):
    return UserRepository(db)


async def get_vendor_repository(db = Depends(get_db)):
    return VendorRepository(db)


async def get_booking_repository(db = Depends(get_db)):
    return BookingRepository(db)


async def get_service_repository(db = Depends(get_db)):
    return ServiceRepository(db)


# Service dependencies
async def get_user_service(user_repo: UserRepository = Depends(get_user_repository)):
    return UserService(user_repo)


async def get_vendor_service(
    vendor_repo: VendorRepository = Depends(get_vendor_repository),
    user_repo: UserRepository = Depends(get_user_repository)
):
    return VendorService(vendor_repo, user_repo)


async def get_booking_service(booking_repo: BookingRepository = Depends(get_booking_repository)):
    return BookingService(booking_repo)


# Authentication dependency
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_service: UserService = Depends(get_user_service)
):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = TokenGenerator.decode_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = await user_service.get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Verify current user is admin"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


async def get_current_vendor(current_user: dict = Depends(get_current_user)):
    """Verify current user is vendor"""
    if current_user.get("role") != "vendor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

