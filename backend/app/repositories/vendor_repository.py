"""
Vendor repository - handles Vendor data access
Following Single Responsibility Principle
"""
from typing import List
from app.repositories.base_repository import BaseRepository


class VendorRepository(BaseRepository):
    """Vendor-specific repository operations"""
    
    def __init__(self, database):
        super().__init__(database, "vendors")
    
    async def get_by_user_id(self, user_id: str):
        """Get vendor by user ID"""
        from bson import ObjectId
        
        # Try multiple formats
        # 1. Try as ObjectId first (most common case)
        try:
            user_obj_id = ObjectId(user_id)
            vendor = await self.find_one({"user_id": user_obj_id})
            if vendor:
                return vendor
        except:
            pass
        
        # 2. Try as string
        vendor = await self.find_one({"user_id": user_id})
        if vendor:
            return vendor
        
        # 3. Try direct MongoDB query with ObjectId
        try:
            user_obj_id = ObjectId(user_id)
            vendor_doc = await self.collection.find_one({"user_id": user_obj_id})
            if vendor_doc:
                vendor_doc["_id"] = str(vendor_doc["_id"])
                return vendor_doc
        except:
            pass
        
        # 4. Try direct MongoDB query with string
        vendor_doc = await self.collection.find_one({"user_id": user_id})
        if vendor_doc:
            vendor_doc["_id"] = str(vendor_doc["_id"])
            return vendor_doc
        
        return None
    
    async def get_by_category(self, category: str, skip: int = 0, limit: int = 100):
        """Get vendors by service category"""
        return await self.find_many(
            {"service_category": category, "is_approved": True, "is_active": True}, 
            skip, 
            limit
        )
    
    async def get_pending_approvals(self, skip: int = 0, limit: int = 100):
        """Get vendors pending approval"""
        return await self.find_many({"is_approved": False}, skip, limit)
    
    async def approve_vendor(self, vendor_id: str):
        """Approve a vendor - sets is_approved to True and ensures is_active is True"""
        return await self.update(vendor_id, {"is_approved": True, "is_active": True})
    
    async def reject_vendor(self, vendor_id: str):
        """Reject a vendor"""
        return await self.update(vendor_id, {"is_approved": False, "is_active": False})
    
    async def get_all_vendors_with_status(self, status_filter: str = None, skip: int = 0, limit: int = 100):
        """Get all vendors with optional status filter"""
        query = {}
        if status_filter == "pending":
            query = {"is_approved": False}
        elif status_filter == "approved":
            query = {"is_approved": True, "is_active": True}
        elif status_filter == "rejected":
            query = {"is_approved": False, "is_active": False}
        # "all" or None returns all vendors
        
        return await self.find_many(query, skip, limit)

