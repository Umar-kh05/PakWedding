from typing import List
from app.repositories.base_repository import BaseRepository


class VendorRepository(BaseRepository):
    
    def __init__(self, database):
        super().__init__(database, "vendors")
    
    async def get_by_user_id(self, user_id: str):
        from bson import ObjectId
        
        try:
            user_obj_id = ObjectId(user_id)
            vendor = await self.find_one({"user_id": user_obj_id})
            if vendor:
                return vendor
        except:
            pass
        
        vendor = await self.find_one({"user_id": user_id})
        if vendor:
            return vendor
        
        try:
            user_obj_id = ObjectId(user_id)
            vendor_doc = await self.collection.find_one({"user_id": user_obj_id})
            if vendor_doc:
                vendor_doc["_id"] = str(vendor_doc["_id"])
                return vendor_doc
        except:
            pass
        
        vendor_doc = await self.collection.find_one({"user_id": user_id})
        if vendor_doc:
            vendor_doc["_id"] = str(vendor_doc["_id"])
            return vendor_doc
        
        return None
    
    async def get_by_category(self, category: str, skip: int = 0, limit: int = 100):
        return await self.find_many(
            {"service_category": category, "is_approved": True, "is_active": True}, 
            skip, 
            limit
        )
    
    async def get_pending_approvals(self, skip: int = 0, limit: int = 100):
        return await self.find_many({"is_approved": False, "is_active": True}, skip, limit)
    
    async def approve_vendor(self, vendor_id: str):
        return await self.update(vendor_id, {"is_approved": True, "is_active": True})
    
    async def reject_vendor(self, vendor_id: str):
        return await self.update(vendor_id, {"is_approved": False, "is_active": False})
    
    async def get_all_vendors_with_status(self, status_filter: str = None, skip: int = 0, limit: int = 100):
        query = {}
        if status_filter == "pending":
            query = {"is_approved": False}
        elif status_filter == "approved":
            query = {"is_approved": True, "is_active": True}
        elif status_filter == "rejected":
            query = {"is_approved": False, "is_active": False}
        
        return await self.find_many(query, skip, limit)

