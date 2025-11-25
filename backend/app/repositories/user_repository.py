"""
User repository - handles User data access
Following Single Responsibility Principle
"""
from typing import Optional
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository):
    """User-specific repository operations"""
    
    def __init__(self, database):
        super().__init__(database, "users")
    
    async def get_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        return await self.find_one({"email": email})
    
    async def get_by_role(self, role: str, skip: int = 0, limit: int = 100):
        """Get users by role"""
        return await self.find_many({"role": role}, skip, limit)

