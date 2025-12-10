from abc import ABC, abstractmethod
from typing import Dict, Any
from datetime import datetime


class EntityFactory(ABC):
    
    @abstractmethod
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        pass


class UserFactory(EntityFactory):
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            **data,
            "is_active": data.get("is_active", True),
            "created_at": data.get("created_at", datetime.utcnow()),
            "updated_at": data.get("updated_at", datetime.utcnow()),
            "email_verified": data.get("email_verified", False),
            "profile_completed": data.get("profile_completed", False)
        }


class VendorFactory(EntityFactory):
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            **data,
            "is_active": data.get("is_active", True),
            "is_approved": data.get("is_approved", False),
            "created_at": data.get("created_at", datetime.utcnow()),
            "updated_at": data.get("updated_at", datetime.utcnow()),
            "rating": data.get("rating", 0.0),
            "total_reviews": data.get("total_reviews", 0),
            "profile_views": data.get("profile_views", 0),
            "packages": data.get("packages", [])
        }


class BookingFactory(EntityFactory):
    
    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            **data,
            "status": data.get("status", "pending"),
            "created_at": data.get("created_at", datetime.utcnow()),
            "updated_at": data.get("updated_at", datetime.utcnow()),
            "payment_status": data.get("payment_status", "pending"),
            "cancellation_reason": data.get("cancellation_reason", None),
            "notes": data.get("notes", "")
        }


class EntityFactoryProvider:
    
    _factories = {
        "user": UserFactory,
        "vendor": VendorFactory,
        "booking": BookingFactory
    }
    
    @classmethod
    def get_factory(cls, entity_type: str) -> EntityFactory:
        factory_class = cls._factories.get(entity_type.lower())
        if not factory_class:
            raise ValueError(f"Unknown entity type: {entity_type}")
        return factory_class()
    
    @classmethod
    def register_factory(cls, entity_type: str, factory_class: type):
        cls._factories[entity_type.lower()] = factory_class

