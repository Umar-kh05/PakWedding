from abc import ABC, abstractmethod
from typing import List, Dict, Any
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class EventType(Enum):
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
    
    def __init__(self, event_type: EventType, data: Dict[str, Any]):
        self.event_type = event_type
        self.data = data
    
    def __str__(self):
        return f"Event({self.event_type.value}, {self.data})"


class Observer(ABC):
    
    @abstractmethod
    async def update(self, event: Event):
        pass


class EmailNotificationObserver(Observer):
    
    def __init__(self, email_service=None):
        self.email_service = email_service
    
    async def update(self, event: Event):
        logger.info(f"EmailObserver: Processing {event.event_type.value}")
        
        if event.event_type == EventType.USER_REGISTERED:
            user_email = event.data.get("email")
            logger.info(f"Sending welcome email to {user_email}")
        
        elif event.event_type == EventType.BOOKING_CONFIRMED:
            user_email = event.data.get("user_email")
            logger.info(f"Sending booking confirmation to {user_email}")
        
        elif event.event_type == EventType.VENDOR_APPROVED:
            vendor_email = event.data.get("email")
            logger.info(f"Sending approval email to {vendor_email}")


class StatisticsObserver(Observer):
    
    async def update(self, event: Event):
        logger.info(f"StatisticsObserver: Processing {event.event_type.value}")
        
        if event.event_type == EventType.BOOKING_CREATED:
            logger.info("Updating booking statistics")
        
        elif event.event_type == EventType.REVIEW_CREATED:
            vendor_id = event.data.get("vendor_id")
            logger.info(f"Updating rating for vendor {vendor_id}")


class AuditLogObserver(Observer):
    
    async def update(self, event: Event):
        logger.info(f"AuditObserver: Logging event {event.event_type.value}")
        logger.info(f"Audit Log: {event}")


class NotificationObserver(Observer):
    
    async def update(self, event: Event):
        logger.info(f"NotificationObserver: Creating notification for {event.event_type.value}")
        
        if event.event_type == EventType.BOOKING_CREATED:
            vendor_id = event.data.get("vendor_id")
            logger.info(f"Notifying vendor {vendor_id} of new booking")
        
        elif event.event_type == EventType.REVIEW_CREATED:
            vendor_id = event.data.get("vendor_id")
            logger.info(f"Notifying vendor {vendor_id} of new review")


class EventManager:
    
    def __init__(self):
        self._observers: Dict[EventType, List[Observer]] = {}
    
    def subscribe(self, event_type: EventType, observer: Observer):
        if event_type not in self._observers:
            self._observers[event_type] = []
        
        if observer not in self._observers[event_type]:
            self._observers[event_type].append(observer)
            logger.info(f"Observer {observer.__class__.__name__} subscribed to {event_type.value}")
    
    def unsubscribe(self, event_type: EventType, observer: Observer):
        if event_type in self._observers:
            if observer in self._observers[event_type]:
                self._observers[event_type].remove(observer)
                logger.info(f"Observer {observer.__class__.__name__} unsubscribed from {event_type.value}")
    
    async def notify(self, event: Event):
        logger.info(f"EventManager: Notifying observers of {event.event_type.value}")
        
        if event.event_type in self._observers:
            for observer in self._observers[event.event_type]:
                try:
                    await observer.update(event)
                except Exception as e:
                    logger.error(f"Error notifying observer {observer.__class__.__name__}: {str(e)}")
    
    async def emit(self, event_type: EventType, data: Dict[str, Any]):
        event = Event(event_type, data)
        await self.notify(event)
    
    def get_observers(self, event_type: EventType) -> List[Observer]:
        return self._observers.get(event_type, [])


_event_manager = None


def get_event_manager() -> EventManager:
    global _event_manager
    if _event_manager is None:
        _event_manager = EventManager()
        _initialize_default_observers(_event_manager)
    return _event_manager


def _initialize_default_observers(manager: EventManager):
    email_observer = EmailNotificationObserver()
    manager.subscribe(EventType.USER_REGISTERED, email_observer)
    manager.subscribe(EventType.BOOKING_CONFIRMED, email_observer)
    manager.subscribe(EventType.VENDOR_APPROVED, email_observer)
    
    stats_observer = StatisticsObserver()
    manager.subscribe(EventType.BOOKING_CREATED, stats_observer)
    manager.subscribe(EventType.REVIEW_CREATED, stats_observer)
    
    audit_observer = AuditLogObserver()
    for event_type in EventType:
        manager.subscribe(event_type, audit_observer)
    
    notification_observer = NotificationObserver()
    manager.subscribe(EventType.BOOKING_CREATED, notification_observer)
    manager.subscribe(EventType.REVIEW_CREATED, notification_observer)

