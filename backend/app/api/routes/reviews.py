"""
Review routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from app.services.review_service import ReviewService
from app.api.dependencies import get_review_service, get_current_user, get_vendor_stats_service, get_vendor_service
from app.models.review import ReviewCreate, ReviewResponse

router = APIRouter()


@router.get("/vendor/{vendor_id}", response_model=List[ReviewResponse])
async def get_vendor_reviews(
    vendor_id: str,
    skip: int = 0,
    limit: int = 100,
    review_service: ReviewService = Depends(get_review_service)
):
    """Get all reviews for a vendor"""
    reviews = await review_service.get_reviews_by_vendor(vendor_id, skip, limit)
    
    # Format reviews
    formatted_reviews = []
    for review in reviews:
        if "_id" in review:
            review["id"] = str(review["_id"])
            del review["_id"]
        if "user_id" in review:
            review["user_id"] = str(review["user_id"])
        if "vendor_id" in review:
            review["vendor_id"] = str(review["vendor_id"])
        if "booking_id" in review and review["booking_id"]:
            review["booking_id"] = str(review["booking_id"])
        
        formatted_reviews.append(review)
    
    return formatted_reviews


@router.get("/vendor/me", response_model=List[ReviewResponse])
async def get_my_vendor_reviews(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    review_service: ReviewService = Depends(get_review_service),
    vendor_service = Depends(get_vendor_service)
):
    """Get reviews for current vendor's business"""
    # Get vendor by user_id
    vendor = await vendor_service.vendor_repo.get_by_user_id(str(current_user["_id"]))
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
    
    vendor_id = str(vendor["_id"])
    reviews = await review_service.get_reviews_by_vendor(vendor_id, skip, limit)
    
    # Format reviews
    formatted_reviews = []
    for review in reviews:
        if "_id" in review:
            review["id"] = str(review["_id"])
            del review["_id"]
        if "user_id" in review:
            review["user_id"] = str(review["user_id"])
        if "vendor_id" in review:
            review["vendor_id"] = str(review["vendor_id"])
        if "booking_id" in review and review["booking_id"]:
            review["booking_id"] = str(review["booking_id"])
        
        formatted_reviews.append(review)
    
    return formatted_reviews

