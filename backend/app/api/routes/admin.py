"""
Admin routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.exceptions import RequestValidationError
from typing import List
from app.services.vendor_service import VendorService
from app.services.user_service import UserService
from app.services.review_service import ReviewService
from app.api.dependencies import get_vendor_service, get_current_admin, get_user_service, get_review_service, get_vendor_stats_service
from app.models.vendor import VendorResponse, VendorCreate
from app.models.user import UserResponse
import traceback

router = APIRouter()


@router.get("/vendors", response_model=List[VendorResponse])
async def get_all_vendors(
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    current_admin: dict = Depends(get_current_admin),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Get all vendors with optional status filter (admin only)"""
    # Map frontend filter to backend status
    status_filter = None
    if status:
        status_filter = status  # pending, approved, rejected, all
    
    vendors = await vendor_service.get_all_vendors_with_status(status_filter, skip, limit)
    return vendors


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
    try:
        vendor = await vendor_service.approve_vendor(vendor_id)
        if not vendor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
        return vendor
    except Exception as e:
        print(f"[ERROR] Error approving vendor {vendor_id}: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to approve vendor: {str(e)}"
        )


@router.post("/vendors/{vendor_id}/reject", response_model=VendorResponse)
async def reject_vendor(
    vendor_id: str,
    current_admin: dict = Depends(get_current_admin),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Reject a vendor (admin only)"""
    try:
        vendor = await vendor_service.reject_vendor(vendor_id)
        if not vendor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
        return vendor
    except Exception as e:
        print(f"[ERROR] Error rejecting vendor {vendor_id}: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reject vendor: {str(e)}"
        )


@router.post("/vendors/create", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def create_vendor(
    vendor_data: VendorCreate,
    current_admin: dict = Depends(get_current_admin),
    vendor_service: VendorService = Depends(get_vendor_service)
):
    """Create a new vendor (admin only, auto-approved)"""
    try:
        # Log the incoming data for debugging
        print(f"[DEBUG] Creating vendor with data: {vendor_data.model_dump()}")
        vendor = await vendor_service.create_vendor_as_admin(vendor_data)
        print(f"[DEBUG] Vendor created, preparing response...")
        
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
        
        print(f"[DEBUG] Returning vendor response with ID: {vendor.get('id')}")
        return vendor
    except ValueError as e:
        print(f"[ERROR] ValueError creating vendor: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"[ERROR] Error creating vendor: {error_msg}")
        print(traceback_str)
        # If it's a validation error, return 400 instead of 500
        if "validation" in error_msg.lower() or "pydantic" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Validation error: {error_msg}"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create vendor: {error_msg}"
        )


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_admin: dict = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Get all users (admin only)"""
    try:
        users = await user_service.user_repo.find_many({}, skip, limit)
        
        # Format users for response
        formatted_users = []
        for user in users:
            formatted_user = user.copy()
            if "_id" in formatted_user:
                formatted_user["id"] = str(formatted_user["_id"])
                del formatted_user["_id"]
            
            # Remove sensitive fields
            formatted_user.pop("hashed_password", None)
            formatted_user.pop("updated_at", None)
            
            formatted_users.append(formatted_user)
        
        return formatted_users
    except Exception as e:
        print(f"[ERROR] Error fetching users: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}"
        )


@router.get("/admin-approvals", response_model=List[UserResponse])
async def get_pending_admin_approvals(
    skip: int = 0,
    limit: int = 100,
    current_admin: dict = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Get pending admin approval requests (admin only)"""
    try:
        # Get users with role=admin and is_admin_approved=False
        pending_admins = await user_service.user_repo.find_many(
            {"role": "admin", "is_admin_approved": False},
            skip,
            limit
        )
        
        # Format users for response
        formatted_users = []
        for user in pending_admins:
            formatted_user = user.copy()
            if "_id" in formatted_user:
                formatted_user["id"] = str(formatted_user["_id"])
                del formatted_user["_id"]
            
            # Remove sensitive fields
            formatted_user.pop("hashed_password", None)
            formatted_user.pop("updated_at", None)
            
            formatted_users.append(formatted_user)
        
        return formatted_users
    except Exception as e:
        print(f"[ERROR] Error fetching pending admin approvals: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch pending admin approvals: {str(e)}"
        )


@router.post("/admin-approvals/{user_id}/approve")
async def approve_admin(
    user_id: str,
    current_admin: dict = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Approve an admin registration (admin only)"""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        if user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not an admin")
        
        # Approve admin: set is_admin_approved to True and is_active to True
        updated_user = await user_service.user_repo.update(
            user_id,
            {"is_admin_approved": True, "is_active": True}
        )
        
        if not updated_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        # Format response
        if "_id" in updated_user:
            updated_user["id"] = str(updated_user["_id"])
            del updated_user["_id"]
        
        updated_user.pop("hashed_password", None)
        updated_user.pop("updated_at", None)
        
        return {
            "message": "Admin approved successfully",
            "user": updated_user
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error approving admin: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to approve admin: {str(e)}"
        )


@router.post("/admin-approvals/{user_id}/reject")
async def reject_admin(
    user_id: str,
    current_admin: dict = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Reject an admin registration (admin only)"""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        if user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not an admin")
        
        # Reject admin: set is_admin_approved to False and is_active to False
        updated_user = await user_service.user_repo.update(
            user_id,
            {"is_admin_approved": False, "is_active": False}
        )
        
        if not updated_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        # Format response
        if "_id" in updated_user:
            updated_user["id"] = str(updated_user["_id"])
            del updated_user["_id"]
        
        updated_user.pop("hashed_password", None)
        updated_user.pop("updated_at", None)
        
        return {
            "message": "Admin registration rejected",
            "user": updated_user
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error rejecting admin: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reject admin: {str(e)}"
        )


@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: str,
    current_admin: dict = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    """Toggle user active status (admin only)"""
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        # Toggle is_active status
        new_status = not user.get("is_active", True)
        updated_user = await user_service.user_repo.update(user_id, {"is_active": new_status})
        
        if not updated_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        # Format response
        if "_id" in updated_user:
            updated_user["id"] = str(updated_user["_id"])
            del updated_user["_id"]
        
        updated_user.pop("hashed_password", None)
        updated_user.pop("updated_at", None)
        
        return {
            "message": f"User {'activated' if new_status else 'deactivated'} successfully",
            "user": updated_user
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error toggling user status: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to toggle user status: {str(e)}"
        )


@router.get("/stats")
async def get_admin_stats(
    current_admin: dict = Depends(get_current_admin),
    vendor_service: VendorService = Depends(get_vendor_service),
    user_service: UserService = Depends(get_user_service),
    review_service: ReviewService = Depends(get_review_service)
):
    """Get dashboard statistics (admin only)"""
    try:
        # Get pending vendors count
        pending_vendors = await vendor_service.get_pending_approvals(0, 1000)
        pending_count = len(pending_vendors)
        
        # Get pending admin approvals count
        pending_admins = await user_service.user_repo.find_many(
            {"role": "admin", "is_admin_approved": False},
            0,
            1000
        )
        pending_admin_count = len(pending_admins)
        
        # Get active users count
        all_users = await user_service.user_repo.find_many({"is_active": True}, 0, 10000)
        active_users_count = len(all_users)
        
        # Get all reviews (we'll count them as flagged reviews for now)
        # In a real app, you'd have a flagged field
        all_reviews = await review_service.review_repo.find_many({}, 0, 10000)
        flagged_reviews_count = len([r for r in all_reviews if r.get("rating", 5) < 3])
        
        return {
            "pendingApprovals": pending_count,
            "pendingAdminApprovals": pending_admin_count,
            "activeUsers": active_users_count,
            "flaggedReviews": flagged_reviews_count
        }
    except Exception as e:
        print(f"[ERROR] Error fetching admin stats: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stats: {str(e)}"
        )


@router.get("/reviews")
async def get_all_reviews(
    skip: int = 0,
    limit: int = 100,
    current_admin: dict = Depends(get_current_admin),
    review_service: ReviewService = Depends(get_review_service),
    user_service: UserService = Depends(get_user_service)
):
    """Get all reviews (admin only)"""
    try:
        reviews = await review_service.get_all_reviews(skip, limit)
        
        # Format reviews for response and add user names
        formatted_reviews = []
        for review in reviews:
            formatted_review = review.copy()
            if "_id" in formatted_review:
                formatted_review["id"] = str(formatted_review["_id"])
                del formatted_review["_id"]
            
            # Ensure all IDs are strings
            if "user_id" in formatted_review:
                formatted_review["user_id"] = str(formatted_review["user_id"])
            if "vendor_id" in formatted_review:
                formatted_review["vendor_id"] = str(formatted_review["vendor_id"])
            if "booking_id" in formatted_review and formatted_review["booking_id"]:
                formatted_review["booking_id"] = str(formatted_review["booking_id"])
            
            # Add user name
            user_id = formatted_review.get("user_id")
            if user_id:
                user = await user_service.get_user_by_id(user_id)
                if user:
                    formatted_review["user_name"] = user.get("full_name", "Anonymous")
            
            formatted_reviews.append(formatted_review)
        
        return formatted_reviews
    except Exception as e:
        print(f"[ERROR] Error fetching reviews: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reviews: {str(e)}"
        )


@router.delete("/reviews/{review_id}")
async def delete_review(
    review_id: str,
    current_admin: dict = Depends(get_current_admin),
    review_service: ReviewService = Depends(get_review_service),
    stats_service = Depends(get_vendor_stats_service)
):
    """Delete a review (admin only)"""
    try:
        deleted = await review_service.delete_review(review_id, stats_service)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        
        return {"message": "Review deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error deleting review: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete review: {str(e)}"
        )

