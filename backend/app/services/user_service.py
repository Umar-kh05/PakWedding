"""
User service - business logic for user operations
Following Single Responsibility Principle and Dependency Inversion Principle
"""
from typing import Optional, List
from datetime import datetime
from app.repositories.user_repository import UserRepository
from app.models.user import UserCreate, UserUpdate, UserResponse
from app.core.security import PasswordHasher


class UserService:
    """User business logic"""
    
    def __init__(self, user_repository: UserRepository):
        self.user_repo = user_repository
        self.password_hasher = PasswordHasher()
    
    async def create_user(self, user_data: UserCreate) -> dict:
        """Create a new user"""
        # Check if user already exists
        existing_user = await self.user_repo.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Hash password
        hashed_password = self.password_hasher.hash_password(user_data.password)
        
        # Create user document
        user_dict = user_data.model_dump(exclude={"password"})
        user_dict["hashed_password"] = hashed_password
        user_dict["is_active"] = True
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        
        return await self.user_repo.create(user_dict)
    
    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        """Get user by ID"""
        return await self.user_repo.get_by_id(user_id)
    
    async def get_user_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        return await self.user_repo.get_by_email(email)
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[dict]:
        """Update user"""
        update_dict = user_data.model_dump(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        return await self.user_repo.update(user_id, update_dict)
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete user"""
        return await self.user_repo.delete(user_id)
    
    async def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        """Authenticate user with email and password"""
        user = await self.user_repo.get_by_email(email)
        if not user:
            return None
        
        if not self.password_hasher.verify_password(password, user["hashed_password"]):
            return None
        
        return user

