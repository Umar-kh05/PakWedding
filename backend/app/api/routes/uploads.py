"""
File upload routes for images
"""
import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from fastapi.responses import FileResponse
from pathlib import Path
from app.api.dependencies import get_current_user, get_current_vendor
from typing import Optional

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
VENDOR_IMAGES_DIR = UPLOAD_DIR / "vendors"
VENDOR_IMAGES_DIR.mkdir(exist_ok=True)
USER_IMAGES_DIR = UPLOAD_DIR / "users"
USER_IMAGES_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


def is_allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


@router.post("/vendor/image")
async def upload_vendor_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_vendor)
):
    """Upload vendor image"""
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{current_user['_id']}_{file.filename}"
    file_path = VENDOR_IMAGES_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL path
    image_url = f"/api/uploads/vendor/{unique_filename}"
    return {"image_url": image_url, "filename": unique_filename}


@router.post("/vendor/gallery")
async def upload_vendor_gallery_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_vendor)
):
    """Upload vendor gallery image"""
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    # Generate unique filename
    import uuid
    file_ext = Path(file.filename).suffix
    unique_filename = f"{current_user['_id']}_{uuid.uuid4()}{file_ext}"
    file_path = VENDOR_IMAGES_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL path
    image_url = f"/api/uploads/vendor/{unique_filename}"
    return {"image_url": image_url, "filename": unique_filename}


@router.get("/vendor/{filename}")
async def get_vendor_image(filename: str):
    """Get vendor image"""
    file_path = VENDOR_IMAGES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    return FileResponse(file_path)


@router.post("/user/image")
async def upload_user_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload user profile image"""
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{current_user['_id']}_{file.filename}"
    file_path = USER_IMAGES_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL path
    image_url = f"/api/uploads/user/{unique_filename}"
    return {"image_url": image_url, "filename": unique_filename}


@router.get("/user/{filename}")
async def get_user_image(filename: str):
    """Get user image"""
    file_path = USER_IMAGES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    return FileResponse(file_path)

