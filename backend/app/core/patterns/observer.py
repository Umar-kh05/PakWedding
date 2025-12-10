"""
Observer Pattern Implementation
Defines a one-to-many dependency between objects so when one object changes state,
all its dependents are notified automatically
Following Single Responsibility Principle and Open/Closed Principle
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class EventType(Enum):
    """Types of events in the system"""
    USER_REGISTERED = "user_registered"
    USER_VERIFIED = "user_verified"
    BOOKING_CREATED = "booking_created"
    BOOKING_CONFIRMED = "booking_confirmed"
    BOOKING_CANCELLED = "booking_cancelled"
    REVIEW_CREATED = "review_created"
    VENDOR_APPROVED = "vendor_approved"
    VENDOR_REJECTED = "vendor_rejected"
    PAYMENT_SUCCESS = "payment_success"
    PAYMENT_FAILED = "payment_failed"


class Event:
    """Event object containing event data"""
    
    def __init__(self, event_type: EventType, data: Dict[str, Any]):
        self.event_type = event_type
        self.data = data
    
    def __str__(self):
        return f"Event({self.event_type.value}, {self.data})"


class Observer(ABC):
    """Abstract observer interface"""
    
    @abstractmethod
    async def update(self, event: Event):
        """Called when an event occurs"""
        pass


class EmailNotificationObserver(Observer):
    """Observer that sends email notifications"""
    
    def __init__(self, email_service=None):
        self.email_service = email_service
    
    async def update(self, event: Event):
        """Send email based on event type"""
        logger.info(f"EmailObserver: Processing {event.event_type.value}")
        
        if event.event_type == EventType.USER_REGISTERED:
            # Send welcome email
            user_email = event.data.get("email")
            logger.info(f"Sending welcome email to {user_email}")
        
        elif event.event_type == EventType.BOOKING_CONFIRMED:
            # Send booking confirmation email
            user_email = event.data.get("user_email")
            logger.info(f"Sending booking confirmation to {user_email}")
        
        elif event.event_type == EventType.VENDOR_APPROVED:
            # Send vendor approval email
            vendor_email = event.data.get("email")
            logger.info(f"Sending approval email to {vendor_email}")


class StatisticsObserver(Observer):
    """Observer that updates statistics"""
    
    async def update(self, event: Event):
        """Update statistics based on event"""
        logger.info(f"StatisticsObserver: Processing {event.event_type.value}")
        
        if event.event_type == EventType.BOOKING_CREATED:
            # Update booking statistics
            logger.info("Updating booking statistics")
        
        elif event.event_type == EventType.REVIEW_CREATED:
            # Update vendor rating
            vendor_id = event.data.get("vendor_id")
            logger.info(f"Updating rating for vendor {vendor_id}")


class AuditLogObserver(Observer):
    """Observer that logs all events for audit purposes"""
    
    async def update(self, event: Event):
        """Log event for audit"""
        logger.info(f"AuditObserver: Logging event {event.event_type.value}")
        # In production, this would write to an audit log database
        logger.info(f"Audit Log: {event}")


class NotificationObserver(Observer):
    """Observer that sends in-app notifications"""
    
    async def update(self, event: Event):
        """Send in-app notification"""
        logger.info(f"NotificationObserver: Creating notification for {event.event_type.value}")
        
        if event.event_type == EventType.BOOKING_CREATED:
            # Notify vendor
            vendor_id = event.data.get("vendor_id")
            logger.info(f"Notifying vendor {vendor_id} of new booking")
        
        elif event.event_type == EventType.REVIEW_CREATED:
            # Notify vendor of new review
            vendor_id = event.data.get("vendor_id")
            logger.info(f"Notifying vendor {vendor_id} of new review")


class EventManager:
    """
    Event Manager (Subject) - manages observers and notifies them of events
    Implements the Observer Pattern
    """
    
    def __init__(self):
        self._observers: Dict[EventType, List[Observer]] = {}
    
    def subscribe(self, event_type: EventType, observer: Observer):
        """Subscribe an observer to an event type"""
        if event_type not in self._observers:
            self._observers[event_type] = []
        
        if observer not in self._observers[event_type]:
            self._observers[event_type].append(observer)
            logger.info(f"Observer {observer.__class__.__name__} subscribed to {event_type.value}")
    
    def unsubscribe(self, event_type: EventType, observer: Observer):
        """Unsubscribe an observer from an event type"""
        if event_type in self._observers:
            if observer in self._observers[event_type]:
                self._observers[event_type].remove(observer)
                logger.info(f"Observer {observer.__class__.__name__} unsubscribed from {event_type.value}")
    
    async def notify(self, event: Event):
        """Notify all observers subscribed to this event type"""
        logger.info(f"EventManager: Notifying observers of {event.event_type.value}")
        
        if event.event_type in self._observers:
            for observer in self._observers[event.event_type]:
                try:
                    await observer.update(event)
                except Exception as e:
                    logger.error(f"Error notifying observer {observer.__class__.__name__}: {str(e)}")
    
    async def emit(self, event_type: EventType, data: Dict[str, Any]):
        """Emit an event"""
        event = Event(event_type, data)
        await self.notify(event)
    
    def get_observers(self, event_type: EventType) -> List[Observer]:
        """Get all observers for an event type"""
        return self._observers.get(event_type, [])


# Global event manager instance (Singleton pattern)
_event_manager = None


def get_event_manager() -> EventManager:
    """Get the global event manager instance (Singleton)"""
    global _event_manager
    if _event_manager is None:
        _event_manager = EventManager()
        # Initialize default observers
        _initialize_default_observers(_event_manager)
    return _event_manager


def _initialize_default_observers(manager: EventManager):
    """Initialize default observers"""
    # Email notifications
    email_observer = EmailNotificationObserver()
    manager.subscribe(EventType.USER_REGISTERED, email_observer)
    manager.subscribe(EventType.BOOKING_CONFIRMED, email_observer)
    manager.subscribe(EventType.VENDOR_APPROVED, email_observer)
    
    # Statistics
    stats_observer = StatisticsObserver()
    manager.subscribe(EventType.BOOKING_CREATED, stats_observer)
    manager.subscribe(EventType.REVIEW_CREATED, stats_observer)
    
    # Audit logging
    audit_observer = AuditLogObserver()
    for event_type in EventType:
        manager.subscribe(event_type, audit_observer)
    
    # In-app notifications
    notification_observer = NotificationObserver()
    manager.subscribe(EventType.BOOKING_CREATED, notification_observer)
    manager.subscribe(EventType.REVIEW_CREATED, notification_observer)

