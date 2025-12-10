"""
Builder Pattern Implementation
Separates the construction of a complex object from its representation
Following Single Responsibility Principle
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime


class VendorProfileBuilder:
    """
    Builder for creating complex vendor profiles
    Allows step-by-step construction of vendor profile
    """
    
    def __init__(self):
        self._profile = {}
    
    def with_basic_info(self, business_name: str, email: str, phone: str) -> 'VendorProfileBuilder':
        """Add basic vendor information"""
        self._profile.update({
            "business_name": business_name,
            "email": email,
            "phone_number": phone
        })
        return self
    
    def with_location(self, address: str, city: str, state: str) -> 'VendorProfileBuilder':
        """Add location information"""
        self._profile.update({
            "address": address,
            "city": city,
            "state": state
        })
        return self
    
    def with_services(self, category: str, description: str, services: List[str]) -> 'VendorProfileBuilder':
        """Add services information"""
        self._profile.update({
            "category": category,
            "description": description,
            "services": services
        })
        return self
    
    def with_pricing(self, price_range: str, packages: List[Dict[str, Any]]) -> 'VendorProfileBuilder':
        """Add pricing information"""
        self._profile.update({
            "price_range": price_range,
            "packages": packages
        })
        return self
    
    def with_media(self, portfolio_images: List[str], videos: List[str] = None) -> 'VendorProfileBuilder':
        """Add media (images and videos)"""
        self._profile.update({
            "portfolio_images": portfolio_images,
            "videos": videos or []
        })
        return self
    
    def with_social_media(self, facebook: str = None, instagram: str = None, website: str = None) -> 'VendorProfileBuilder':
        """Add social media links"""
        self._profile.update({
            "facebook": facebook,
            "instagram": instagram,
            "website": website
        })
        return self
    
    def with_availability(self, available_from: str, available_to: str, unavailable_dates: List[str] = None) -> 'VendorProfileBuilder':
        """Add availability information"""
        self._profile.update({
            "available_from": available_from,
            "available_to": available_to,
            "unavailable_dates": unavailable_dates or []
        })
        return self
    
    def with_policies(self, cancellation_policy: str, terms_conditions: str) -> 'VendorProfileBuilder':
        """Add policies"""
        self._profile.update({
            "cancellation_policy": cancellation_policy,
            "terms_conditions": terms_conditions
        })
        return self
    
    def build(self) -> Dict[str, Any]:
        """Build and return the vendor profile"""
        # Add timestamps and defaults
        self._profile.update({
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True,
            "is_approved": False,
            "rating": 0.0,
            "total_reviews": 0
        })
        return self._profile
    
    def reset(self) -> 'VendorProfileBuilder':
        """Reset the builder"""
        self._profile = {}
        return self


class BookingBuilder:
    """
    Builder for creating booking objects
    Allows flexible booking creation with validation
    """
    
    def __init__(self):
        self._booking = {}
    
    def for_user(self, user_id: str, user_name: str, user_email: str) -> 'BookingBuilder':
        """Set user information"""
        self._booking.update({
            "user_id": user_id,
            "user_name": user_name,
            "user_email": user_email
        })
        return self
    
    def for_vendor(self, vendor_id: str, vendor_name: str) -> 'BookingBuilder':
        """Set vendor information"""
        self._booking.update({
            "vendor_id": vendor_id,
            "vendor_name": vendor_name
        })
        return self
    
    def with_service(self, service_id: str, service_name: str, package_id: Optional[str] = None) -> 'BookingBuilder':
        """Set service information"""
        self._booking.update({
            "service_id": service_id,
            "service_name": service_name,
            "package_id": package_id
        })
        return self
    
    def on_date(self, event_date: str, booking_date: str = None) -> 'BookingBuilder':
        """Set dates"""
        self._booking.update({
            "event_date": event_date,
            "booking_date": booking_date or datetime.utcnow().isoformat()
        })
        return self
    
    def with_pricing(self, amount: float, currency: str = "PKR", advance_amount: float = 0) -> 'BookingBuilder':
        """Set pricing information"""
        self._booking.update({
            "amount": amount,
            "currency": currency,
            "advance_amount": advance_amount,
            "remaining_amount": amount - advance_amount
        })
        return self
    
    def with_details(self, event_type: str, guests_count: int, venue: str, special_requests: str = None) -> 'BookingBuilder':
        """Set event details"""
        self._booking.update({
            "event_type": event_type,
            "guests_count": guests_count,
            "venue": venue,
            "special_requests": special_requests or ""
        })
        return self
    
    def with_status(self, status: str = "pending", payment_status: str = "pending") -> 'BookingBuilder':
        """Set status"""
        self._booking.update({
            "status": status,
            "payment_status": payment_status
        })
        return self
    
    def build(self) -> Dict[str, Any]:
        """Build and return the booking"""
        # Validate required fields
        required_fields = ["user_id", "vendor_id", "event_date", "amount"]
        for field in required_fields:
            if field not in self._booking:
                raise ValueError(f"Required field '{field}' is missing")
        
        # Add defaults
        self._booking.setdefault("status", "pending")
        self._booking.setdefault("payment_status", "pending")
        self._booking.setdefault("created_at", datetime.utcnow())
        self._booking.setdefault("updated_at", datetime.utcnow())
        
        return self._booking
    
    def reset(self) -> 'BookingBuilder':
        """Reset the builder"""
        self._booking = {}
        return self


class QueryBuilder:
    """
    Builder for constructing complex database queries
    Provides fluent interface for query construction
    """
    
    def __init__(self):
        self._filters = {}
        self._sort = []
        self._skip = 0
        self._limit = 100
        self._projection = None
    
    def where(self, field: str, value: Any) -> 'QueryBuilder':
        """Add equality filter"""
        self._filters[field] = value
        return self
    
    def where_in(self, field: str, values: List[Any]) -> 'QueryBuilder':
        """Add IN filter"""
        self._filters[field] = {"$in": values}
        return self
    
    def where_not(self, field: str, value: Any) -> 'QueryBuilder':
        """Add NOT EQUAL filter"""
        self._filters[field] = {"$ne": value}
        return self
    
    def where_gt(self, field: str, value: Any) -> 'QueryBuilder':
        """Add greater than filter"""
        self._filters[field] = {"$gt": value}
        return self
    
    def where_gte(self, field: str, value: Any) -> 'QueryBuilder':
        """Add greater than or equal filter"""
        self._filters[field] = {"$gte": value}
        return self
    
    def where_lt(self, field: str, value: Any) -> 'QueryBuilder':
        """Add less than filter"""
        self._filters[field] = {"$lt": value}
        return self
    
    def where_lte(self, field: str, value: Any) -> 'QueryBuilder':
        """Add less than or equal filter"""
        self._filters[field] = {"$lte": value}
        return self
    
    def where_regex(self, field: str, pattern: str, case_insensitive: bool = True) -> 'QueryBuilder':
        """Add regex filter"""
        options = "i" if case_insensitive else ""
        self._filters[field] = {"$regex": pattern, "$options": options}
        return self
    
    def sort_by(self, field: str, ascending: bool = True) -> 'QueryBuilder':
        """Add sort field"""
        self._sort.append((field, 1 if ascending else -1))
        return self
    
    def skip(self, count: int) -> 'QueryBuilder':
        """Set skip value for pagination"""
        self._skip = count
        return self
    
    def limit(self, count: int) -> 'QueryBuilder':
        """Set limit value for pagination"""
        self._limit = count
        return self
    
    def select(self, fields: List[str]) -> 'QueryBuilder':
        """Set projection (select specific fields)"""
        self._projection = {field: 1 for field in fields}
        return self
    
    def build(self) -> Dict[str, Any]:
        """Build and return the query parameters"""
        return {
            "filter": self._filters,
            "sort": self._sort,
            "skip": self._skip,
            "limit": self._limit,
            "projection": self._projection
        }
    
    def reset(self) -> 'QueryBuilder':
        """Reset the builder"""
        self._filters = {}
        self._sort = []
        self._skip = 0
        self._limit = 100
        self._projection = None
        return self

