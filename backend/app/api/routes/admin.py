"""
Admin routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.vendor_service import VendorService
from app.api.dependencies import get_vendor_service, get_current_admin
from app.models.vendor import VendorResponse

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

