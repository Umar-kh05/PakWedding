"""
Design Patterns Package
Implements common design patterns for clean, maintainable code
"""
from .factory import EntityFactory, EntityFactoryProvider, UserFactory, VendorFactory, BookingFactory
from .strategy import (
    NotificationStrategy, NotificationContext,
    EmailNotificationStrategy, SMSNotificationStrategy, PushNotificationStrategy,
    PaymentStrategy, PaymentContext,
    CreditCardPaymentStrategy, BankTransferPaymentStrategy
)
from .observer import (
    Observer, Event, EventType, EventManager,
    get_event_manager,
    EmailNotificationObserver, StatisticsObserver, AuditLogObserver, NotificationObserver
)
from .builder import VendorProfileBuilder, BookingBuilder, QueryBuilder
from .singleton import (
    ApplicationConfig, CacheManager, RequestCounter, MetricsCollector,
    get_config, get_cache, get_request_counter, get_metrics
)

__all__ = [
    # Factory Pattern
    'EntityFactory', 'EntityFactoryProvider', 'UserFactory', 'VendorFactory', 'BookingFactory',
    
    # Strategy Pattern
    'NotificationStrategy', 'NotificationContext',
    'EmailNotificationStrategy', 'SMSNotificationStrategy', 'PushNotificationStrategy',
    'PaymentStrategy', 'PaymentContext',
    'CreditCardPaymentStrategy', 'BankTransferPaymentStrategy',
    
    # Observer Pattern
    'Observer', 'Event', 'EventType', 'EventManager', 'get_event_manager',
    'EmailNotificationObserver', 'StatisticsObserver', 'AuditLogObserver', 'NotificationObserver',
    
    # Builder Pattern
    'VendorProfileBuilder', 'BookingBuilder', 'QueryBuilder',
    
    # Singleton Pattern
    'ApplicationConfig', 'CacheManager', 'RequestCounter', 'MetricsCollector',
    'get_config', 'get_cache', 'get_request_counter', 'get_metrics',
]

