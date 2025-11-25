"""
Service repository - handles Service data access
Following Single Responsibility Principle
"""
from app.repositories.base_repository import BaseRepository


class ServiceRepository(BaseRepository):
    """Service-specific repository operations"""
    
    def __init__(self, database):
        super().__init__(database, "services")
    
    async def get_by_vendor_id(self, vendor_id: str, skip: int = 0, limit: int = 100):
        """Get services by vendor ID"""
        return await self.find_many({"vendor_id": vendor_id, "is_active": True}, skip, limit)
    
    async def get_by_category(self, category: str, skip: int = 0, limit: int = 100):
        """Get services by category"""
        return await self.find_many({"category": category, "is_active": True}, skip, limit)

