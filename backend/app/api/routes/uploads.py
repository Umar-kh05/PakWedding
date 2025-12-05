"""
File upload routes for images using Cloudinary
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from pathlib import Path
from app.api.dependencies import get_current_user, get_current_vendor, get_current_admin
from app.services.cloudinary_service import CloudinaryService
import uuid

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"}


def is_allowed_file(filename: str, content_type: str = None) -> bool:
    """Check if file extension and MIME type are allowed"""
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        return False
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        return False
    return True


@router.post("/vendor/image")
async def upload_vendor_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_vendor)
):
    """Upload vendor main image to Cloudinary"""
    if not is_allowed_file(file.filename, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    # Read file content
    file_content = await file.read()
    
    # Generate unique public_id
    file_ext = Path(file.filename).suffix
    public_id = f"vendors/{current_user['_id']}/main_{uuid.uuid4()}"
    
    try:
        # Upload to Cloudinary
        upload_result = await CloudinaryService.upload_image(
            file_content=file_content,
            folder="vendors",
            public_id=public_id
        )
        
        return {
            "image_url": upload_result["url"],
            "public_id": upload_result["public_id"],
            "message": "Image uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )


@router.post("/vendor/gallery")
async def upload_vendor_gallery_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_vendor)
):
    """Upload vendor gallery image to Cloudinary"""
    if not is_allowed_file(file.filename, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    # Read file content
    file_content = await file.read()
    
    # Generate unique public_id
    public_id = f"vendors/{current_user['_id']}/gallery_{uuid.uuid4()}"
    
    try:
        # Upload to Cloudinary
        upload_result = await CloudinaryService.upload_image(
            file_content=file_content,
            folder="vendors",
            public_id=public_id
        )
        
        return {
            "image_url": upload_result["url"],
            "public_id": upload_result["public_id"],
            "message": "Gallery image uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )


@router.delete("/vendor/image/{public_id}")
async def delete_vendor_image(
    public_id: str,
    current_user: dict = Depends(get_current_vendor)
):
    """Delete vendor image from Cloudinary"""
    # Verify the image belongs to the vendor
    if not public_id.startswith(f"vendors/{current_user['_id']}/"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own images"
        )
    
    try:
        result = await CloudinaryService.delete_image(public_id)
        return {"message": "Image deleted successfully", "result": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete image: {str(e)}"
        )


@router.post("/user/image")
async def upload_user_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload user profile image to Cloudinary"""
    if not is_allowed_file(file.filename, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    # Read file content
    file_content = await file.read()
    
    # Generate unique public_id
    public_id = f"users/{current_user['_id']}/profile_{uuid.uuid4()}"
    
    try:
        # Upload to Cloudinary
        upload_result = await CloudinaryService.upload_image(
            file_content=file_content,
            folder="users",
            public_id=public_id
        )
        
        return {
            "image_url": upload_result["url"],
            "public_id": upload_result["public_id"],
            "message": "Image uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )


@router.post("/admin/vendor/image")
async def upload_vendor_image_admin(
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin)
):
    """Upload vendor image as admin (for creating new vendors)"""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    if not is_allowed_file(file.filename, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        if not file_content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File is empty"
            )
        
        # Generate unique public_id using admin ID
        admin_id = str(current_admin.get("_id") or current_admin.get("id", "admin"))
        public_id = f"vendors/admin/{admin_id}/main_{uuid.uuid4()}"
        
        # Upload to Cloudinary
        upload_result = await CloudinaryService.upload_image(
            file_content=file_content,
            folder="vendors",
            public_id=public_id
        )
        
        if not upload_result.get("url"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Cloudinary upload succeeded but no URL returned"
            )
        
        return {
            "image_url": upload_result["url"],
            "public_id": upload_result["public_id"],
            "message": "Image uploaded successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"Error uploading admin vendor image: {error_msg}")
        print(traceback_str)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {error_msg}"
        )

