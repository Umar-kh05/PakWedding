"""
Vendor service - business logic for vendor operations
Following Single Responsibility Principle
"""
from typing import Optional, List
from datetime import datetime
from app.repositories.vendor_repository import VendorRepository
from app.repositories.user_repository import UserRepository
from app.models.vendor import VendorCreate, VendorUpdate
from app.core.security import PasswordHasher


class VendorService:
    """Vendor business logic"""
    
    def __init__(self, vendor_repository: VendorRepository, user_repository: UserRepository):
        self.vendor_repo = vendor_repository
        self.user_repo = user_repository
        self.password_hasher = PasswordHasher()
    
    async def register_vendor(self, vendor_data: VendorCreate) -> dict:
        """Register a new vendor"""
        # Create user account first
        user_dict = {
            "email": vendor_data.email,
            "full_name": vendor_data.contact_person,
            "phone_number": vendor_data.phone_number,
            "role": "vendor",
            "hashed_password": self.password_hasher.hash_password(vendor_data.password),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        user = await self.user_repo.create(user_dict)
        
        # Create vendor profile
        vendor_dict = vendor_data.model_dump(exclude={"password"})
        vendor_dict["user_id"] = user["_id"]
        vendor_dict["is_approved"] = False
        vendor_dict["is_active"] = True
        vendor_dict["created_at"] = datetime.utcnow()
        vendor_dict["updated_at"] = datetime.utcnow()
        
        return await self.vendor_repo.create(vendor_dict)
    
    async def get_vendor_by_id(self, vendor_id: str) -> Optional[dict]:
        """Get vendor by ID"""
        return await self.vendor_repo.get_by_id(vendor_id)
    
    async def get_vendors_by_category(self, category: str, skip: int = 0, limit: int = 100):
        """Get vendors by category"""
        return await self.vendor_repo.get_by_category(category, skip, limit)
    
    async def update_vendor(self, vendor_id: str, vendor_data: VendorUpdate) -> Optional[dict]:
        """Update vendor"""
        update_dict = vendor_data.model_dump(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        return await self.vendor_repo.update(vendor_id, update_dict)
    
    async def approve_vendor(self, vendor_id: str) -> Optional[dict]:
        """Approve vendor (admin only)"""
        return await self.vendor_repo.approve_vendor(vendor_id)
    
    async def get_pending_approvals(self, skip: int = 0, limit: int = 100):
        """Get vendors pending approval"""
        return await self.vendor_repo.get_pending_approvals(skip, limit)

