"""
Admin routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.vendor_service import VendorService
from app.api.dependencies import get_vendor_service, get_current_admin
from app.models.vendor import VendorResponse, VendorCreate

router = APIRouter()


@router.get("/vendors/pending", response_model=List[VendorResponse])
async def get_pending_vendors(
    skip: int = 0,
    limit: int = 100,
    current_admin: dict = Depends(get_current_admin),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get vendors pending approval (admin only)"""
    vendors = await vendor_service.get_pending_approvals(skip, limit)
    return vendors


@router.post("/vendors/{vendor_id}/approve", response_model=VendorResponse)
async def approve_vendor(
    vendor_id: str,
    current_admin: dict = Depends(get_current_admin),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Approve a vendor (admin only)"""
    vendor = await vendor_service.approve_vendor(vendor_id)
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return vendor


@router.post("/vendors/create", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def create_vendor(
    vendor_data: VendorCreate,
    current_admin: dict = Depends(get_current_admin),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Create a new vendor (admin only, auto-approved)"""
    try:
        vendor = await vendor_service.create_vendor_as_admin(vendor_data)
        
        # Convert _id to id for response model
        vendor_id = vendor.get("_id") or vendor.get("id")
        if vendor_id:
            vendor["id"] = str(vendor_id)
            if "_id" in vendor:
                del vendor["_id"]
        
        # Convert user_id to string if it exists
        if "user_id" in vendor:
            vendor["user_id"] = str(vendor["user_id"])
        
        # Remove fields not in VendorResponse
        vendor.pop("hashed_password", None)
        vendor.pop("updated_at", None)
        
        return vendor
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"Error creating vendor: {error_msg}")
        print(traceback_str)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create vendor: {error_msg}"
        )

