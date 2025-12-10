from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from app.services.review_service import ReviewService
from app.api.dependencies import get_review_service, get_current_user, get_vendor_stats_service, get_vendor_service
from app.models.review import ReviewCreate, ReviewResponse

router = APIRouter()


@router.get("/user", response_model=List[ReviewResponse])
async def get_user_reviews(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    review_service: ReviewService = Depends(get_review_service)
):
    user_id = str(current_user["_id"])
    reviews = await review_service.get_reviews_by_user(user_id, skip, limit)
    
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
    try:
        user_id = str(current_user.get("_id") or current_user.get("id"))
        vendor = await vendor_service.vendor_repo.get_by_user_id(user_id)
        if not vendor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor profile not found")
        
        vendor_id = str(vendor.get("_id") or vendor.get("id"))
        if not vendor_id:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid vendor ID")
        
        print(f"[DEBUG GET REVIEWS] Vendor found - _id: {vendor.get('_id')}, id: {vendor.get('id')}, vendor_id: {vendor_id}")
        
        all_reviews_debug = await review_service.review_repo.find_many({}, 0, 1000)
        print(f"[DEBUG GET REVIEWS] Total reviews in database: {len(all_reviews_debug)}")
        for r in all_reviews_debug[:10]:
            vendor_id_in_review = r.get('vendor_id')
            vendor_id_str = str(vendor_id_in_review) if vendor_id_in_review else None
            print(f"[DEBUG GET REVIEWS] Review ID: {r.get('_id')}, vendor_id: {vendor_id_in_review} (type: {type(vendor_id_in_review)}, as string: {vendor_id_str})")
            print(f"[DEBUG GET REVIEWS] Comparing: review vendor_id '{vendor_id_str}' == query vendor_id '{vendor_id}': {vendor_id_str == vendor_id}")
        
        print(f"[DEBUG GET REVIEWS] Fetching reviews for vendor_id: {vendor_id}")
        reviews = await review_service.get_reviews_by_vendor(vendor_id, skip, limit)
        print(f"[DEBUG GET REVIEWS] Found {len(reviews)} reviews for vendor_id {vendor_id}")
        
        if len(reviews) == 0:
            from bson import ObjectId
            try:
                vendor_obj_id = ObjectId(vendor_id)
                print(f"[DEBUG GET REVIEWS] Trying direct query with ObjectId: {vendor_obj_id}")
                cursor = review_service.review_repo.collection.find({"vendor_id": vendor_obj_id})
                direct_reviews = await cursor.to_list(length=100)
                print(f"[DEBUG GET REVIEWS] Direct query found {len(direct_reviews)} reviews")
                if direct_reviews:
                    for dr in direct_reviews:
                        if "_id" in dr:
                            dr["_id"] = str(dr["_id"])
                    reviews = direct_reviews
            except Exception as e:
                print(f"[DEBUG GET REVIEWS] Direct ObjectId query failed: {e}")
        
        formatted_reviews = []
        for review in reviews:
            formatted_review = review.copy()
            
            if "_id" in formatted_review:
                formatted_review["id"] = str(formatted_review["_id"])
                del formatted_review["_id"]
            if "user_id" in formatted_review:
                formatted_review["user_id"] = str(formatted_review["user_id"])
            if "vendor_id" in formatted_review:
                formatted_review["vendor_id"] = str(formatted_review["vendor_id"])
            if "booking_id" in formatted_review and formatted_review["booking_id"]:
                formatted_review["booking_id"] = str(formatted_review["booking_id"])
            
            if "created_at" in formatted_review:
                if hasattr(formatted_review["created_at"], "isoformat"):
                    formatted_review["created_at"] = formatted_review["created_at"].isoformat()
            
            formatted_reviews.append(formatted_review)
        
        print(f"[DEBUG] Returning {len(formatted_reviews)} formatted reviews")
        return formatted_reviews
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error fetching vendor reviews: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reviews: {str(e)}"
        )


@router.get("/vendor/{vendor_id}", response_model=List[ReviewResponse])
async def get_vendor_reviews(
    vendor_id: str,
    skip: int = 0,
    limit: int = 100,
    review_service: ReviewService = Depends(get_review_service)
):
    reviews = await review_service.get_reviews_by_vendor(vendor_id, skip, limit)
    
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
    try:
        review_dict = review_data.model_dump()
        review_dict["user_id"] = str(current_user["_id"])
        
        original_vendor_id = review_dict.get("vendor_id")
        if "vendor_id" in review_dict:
            review_dict["vendor_id"] = str(review_dict["vendor_id"])
        
        print(f"[DEBUG CREATE REVIEW] Original vendor_id: {original_vendor_id}, Converted: {review_dict['vendor_id']}")
        
        if "booking_id" in review_dict and review_dict["booking_id"]:
            review_dict["booking_id"] = str(review_dict["booking_id"])
            print(f"[DEBUG CREATE REVIEW] Booking ID: {review_dict['booking_id']}")
        
        from app.models.review import ReviewBase
        review_create = ReviewBase(**review_dict)
        review = await review_service.create_review(review_create, stats_service)
        
        print(f"[DEBUG CREATE REVIEW] Review created with vendor_id: {review.get('vendor_id')} (type: {type(review.get('vendor_id'))})")
        
        if "_id" in review:
            review["id"] = str(review["_id"])
            del review["_id"]
        
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

