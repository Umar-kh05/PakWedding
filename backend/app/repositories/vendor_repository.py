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
        return await self.find_one({"user_id": user_id})
    
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
        """Approve a vendor"""
        return await self.update(vendor_id, {"is_approved": True})

