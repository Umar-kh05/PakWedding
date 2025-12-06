"""
Vendor routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from typing import List
from app.services.vendor_service import VendorService
from app.api.dependencies import get_vendor_service, get_current_vendor
from app.models.vendor import VendorCreate, VendorUpdate, VendorResponse

router = APIRouter()


@router.post("/register", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def register_vendor(
    vendor_data: VendorCreate,
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Register as a vendor"""
    vendor = await vendor_service.register_vendor(vendor_data)
    return vendor


@router.get("/", response_model=List[VendorResponse])
async def get_vendors(
    category: str = Query(None),
    skip: int = 0,
    limit: int = Query(200, ge=1, le=1000),  # Increase default limit to 200, max 1000
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get all approved vendors, optionally filtered by category"""
    if category:
        vendors = await vendor_service.get_vendors_by_category(category, skip, limit)
    else:
        # Only return approved and active vendors
        vendors = await vendor_service.vendor_repo.find_many(
            {"is_approved": True, "is_active": True}, 
            skip, 
            limit
        )
    
    # Convert _id to id for all vendors
    formatted_vendors = []
    for vendor in vendors:
        if "_id" in vendor:
            vendor["id"] = str(vendor["_id"])
            del vendor["_id"]
        # Remove fields not in VendorResponse
        vendor.pop("user_id", None)
        vendor.pop("hashed_password", None)
        vendor.pop("updated_at", None)
        
        # Ensure packages is a list (not None)
        if "packages" not in vendor or vendor["packages"] is None or len(vendor.get("packages", [])) == 0:
            # If no packages, set empty list
            vendor["packages"] = []
        else:
            # Ensure packages have proper structure
            vendor["packages"] = vendor["packages"]
        
        formatted_vendors.append(vendor)
    
    return formatted_vendors


@router.get("/me", response_model=VendorResponse)
async def get_vendor_profile(
    current_user: dict = Depends(get_current_vendor),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get current vendor's own profile"""
    vendor = await vendor_service.vendor_repo.get_by_user_id(current_user["_id"])
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
    
    # Format vendor response
    if "_id" in vendor:
        vendor["id"] = str(vendor["_id"])
        del vendor["_id"]
    
    # Remove sensitive fields
    vendor.pop("user_id", None)
    vendor.pop("hashed_password", None)
    vendor.pop("updated_at", None)
    
    # Ensure packages is a list
    if "packages" not in vendor or vendor["packages"] is None:
        vendor["packages"] = []
    
    # Ensure gallery_images is a list
    if "gallery_images" not in vendor or vendor["gallery_images"] is None:
        vendor["gallery_images"] = []
    
    return vendor


@router.put("/me", response_model=VendorResponse)
async def update_vendor_profile(
    vendor_data: VendorUpdate,
    current_user: dict = Depends(get_current_vendor),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Update vendor profile"""
    vendor = await vendor_service.vendor_repo.get_by_user_id(current_user["_id"])
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
    
    updated_vendor = await vendor_service.update_vendor(vendor["_id"], vendor_data)
    
    # Format response
    if "_id" in updated_vendor:
        updated_vendor["id"] = str(updated_vendor["_id"])
        del updated_vendor["_id"]
    
    updated_vendor.pop("user_id", None)
    updated_vendor.pop("hashed_password", None)
    updated_vendor.pop("updated_at", None)
    
    if "packages" not in updated_vendor or updated_vendor["packages"] is None:
        updated_vendor["packages"] = []
    
    if "gallery_images" not in updated_vendor or updated_vendor["gallery_images"] is None:
        updated_vendor["gallery_images"] = []
    
    return updated_vendor


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(
    vendor_id: str,
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get vendor by ID"""
    # Validate vendor_id format (should be a valid ObjectId)
    from bson import ObjectId
    from bson.errors import InvalidId
    
    try:
        # Try to validate ObjectId format
        ObjectId(vendor_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Invalid vendor ID format: '{vendor_id}'. Vendor ID must be a valid MongoDB ObjectId."
        )
    
    vendor = await vendor_service.get_vendor_by_id(vendor_id)
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    
    # Format vendor response (convert _id to id, remove sensitive fields)
    if "_id" in vendor:
        vendor["id"] = str(vendor["_id"])
        del vendor["_id"]
    
    # Remove fields not in VendorResponse
    vendor.pop("user_id", None)
    vendor.pop("hashed_password", None)
    vendor.pop("updated_at", None)
    
    # Ensure gallery_images is a list (not None)
    if "gallery_images" not in vendor or vendor["gallery_images"] is None:
        vendor["gallery_images"] = []
    
    # Ensure packages is a list (not None)
    if "packages" not in vendor or vendor["packages"] is None:
        vendor["packages"] = []
    
    return vendor


@router.patch("/me/image", response_model=VendorResponse)
async def update_vendor_image(
    image_url: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_vendor),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Update vendor main image URL after Cloudinary upload"""
    vendor = await vendor_service.vendor_repo.get_by_user_id(current_user["_id"])
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
    
    updated_vendor = await vendor_service.update_vendor(
        vendor["_id"], 
        VendorUpdate(image_url=image_url)
    )
    return updated_vendor


@router.patch("/me/gallery", response_model=VendorResponse)
async def add_to_vendor_gallery(
    image_url: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_vendor),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Add image URL to vendor gallery after Cloudinary upload"""
    vendor = await vendor_service.vendor_repo.get_by_user_id(current_user["_id"])
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
    
    # Get current gallery images
    current_gallery = vendor.get("gallery_images", []) or []
    if image_url not in current_gallery:
        current_gallery.append(image_url)
    
    updated_vendor = await vendor_service.update_vendor(
        vendor["_id"], 
        VendorUpdate(gallery_images=current_gallery)
    )
    return updated_vendor

