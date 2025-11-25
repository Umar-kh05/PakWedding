"""
Vendor routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
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
    limit: int = 100,
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get all vendors, optionally filtered by category"""
    if category:
        vendors = await vendor_service.get_vendors_by_category(category, skip, limit)
    else:
        vendors = await vendor_service.vendor_repo.get_all(skip, limit)
    return vendors


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(
    vendor_id: str,
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get vendor by ID"""
    vendor = await vendor_service.get_vendor_by_id(vendor_id)
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
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
    return updated_vendor

