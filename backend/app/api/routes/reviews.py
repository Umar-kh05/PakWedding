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


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: ReviewCreate,
    current_user: dict = Depends(get_current_user),
    review_service: ReviewService = Depends(get_review_service),
    stats_service = Depends(get_vendor_stats_service)
):
    """Create a new review"""
    try:
        # Set user_id from current user
        review_dict = review_data.model_dump()
        review_dict["user_id"] = str(current_user["_id"])
        
        # Ensure vendor_id is a string
        if "vendor_id" in review_dict:
            review_dict["vendor_id"] = str(review_dict["vendor_id"])
        
        # Ensure booking_id is a string if provided
        if "booking_id" in review_dict and review_dict["booking_id"]:
            review_dict["booking_id"] = str(review_dict["booking_id"])
        
        # Create review
        from app.models.review import ReviewCreate as ReviewCreateModel
        review_create = ReviewCreateModel(**review_dict)
        review = await review_service.create_review(review_create, stats_service)
        
        # Format response
        if "_id" in review:
            review["id"] = str(review["_id"])
            del review["_id"]
        
        # Ensure all IDs are strings
        if "user_id" in review:
            review["user_id"] = str(review["user_id"])
        if "vendor_id" in review:
            review["vendor_id"] = str(review["vendor_id"])
        if "booking_id" in review and review["booking_id"]:
            review["booking_id"] = str(review["booking_id"])
        
        return review
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        print(f"[ERROR] Error creating review: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create review: {str(e)}"
        )

