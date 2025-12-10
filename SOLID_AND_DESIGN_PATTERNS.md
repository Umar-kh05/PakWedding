# SOLID Principles and Design Patterns Implementation

This document describes the SOLID principles and Design Patterns implemented in the PakWedding Portal application.

---

## Table of Contents
1. [SOLID Principles](#solid-principles)
2. [Design Patterns](#design-patterns)
3. [Implementation Details](#implementation-details)
4. [Benefits](#benefits)

---

## SOLID Principles

### 1. **Single Responsibility Principle (SRP)**
> A class should have one, and only one, reason to change.

#### Implementation:
- **Repositories** (`app/repositories/*.py`): Each repository is responsible for data access for a single entity
  - `UserRepository` - Only handles user data operations
  - `VendorRepository` - Only handles vendor data operations
  - `BookingRepository` - Only handles booking data operations

- **Services** (`app/services/*.py`): Each service handles business logic for a single domain
  - `UserService` - User-related business logic
  - `VendorService` - Vendor-related business logic
  - `BookingService` - Booking-related business logic

- **Validators** (`app/core/password_validator.py`): Single responsibility for password validation

**Example:**
```python
class UserRepository(BaseRepository):
    """Only responsible for user data access"""
    def __init__(self, database):
        super().__init__(database, "users")
```

---

### 2. **Open/Closed Principle (OCP)**
> Software entities should be open for extension but closed for modification.

#### Implementation:
- **Base Repository** (`app/repositories/base_repository.py`): Can be extended without modification
  ```python
  class BaseRepository(IRepository[T]):
      # Core CRUD operations - closed for modification
      # Can be extended by inheriting classes
  ```

- **Factory Pattern** (`app/core/patterns/factory.py`): New factories can be added without modifying existing code
  ```python
  EntityFactoryProvider.register_factory("new_type", NewFactory)
  ```

- **Strategy Pattern** (`app/core/patterns/strategy.py`): New strategies can be added without changing existing code

---

### 3. **Liskov Substitution Principle (LSP)**
> Derived classes must be substitutable for their base classes.

#### Implementation:
- **Repository Hierarchy**: All repositories can be used interchangeably through IRepository interface
  ```python
  def process_data(repo: IRepository):
      # Can work with any repository implementation
      data = await repo.get_by_id(id)
  ```

- **Strategy Pattern**: All strategies implement the same interface and can be swapped
  ```python
  class EmailNotificationStrategy(NotificationStrategy):
      async def send(self, recipient, subject, message, data):
          # Implementation
  
  class SMSNotificationStrategy(NotificationStrategy):
      async def send(self, recipient, subject, message, data):
          # Implementation
  ```

---

### 4. **Interface Segregation Principle (ISP)**
> Clients should not be forced to depend on interfaces they don't use.

#### Implementation:
- **IRepository Interface** (`app/repositories/base_repository.py`): Minimal interface with only essential methods
  ```python
  class IRepository(ABC, Generic[T]):
      @abstractmethod
      async def create(self, entity: T) -> T: pass
      @abstractmethod
      async def get_by_id(self, entity_id: str) -> Optional[T]: pass
      # Only essential CRUD operations
  ```

- **Strategy Interfaces**: Each strategy type has its own focused interface
  - `NotificationStrategy` - Only notification methods
  - `PaymentStrategy` - Only payment methods

---

### 5. **Dependency Inversion Principle (DIP)**
> High-level modules should not depend on low-level modules. Both should depend on abstractions.

#### Implementation:
- **Dependency Injection** (`app/api/dependencies.py`): Services depend on abstractions, not concrete implementations
  ```python
  class UserService:
      def __init__(self, user_repository: UserRepository):
          self.user_repo = user_repository  # Depends on abstraction
  ```

- **FastAPI Dependencies**: All dependencies are injected through FastAPI's DI system
  ```python
  @router.post("/users")
  async def create_user(
      user_service: UserService = Depends(get_user_service)
  ):
      # Service is injected, not instantiated
  ```

---

## Design Patterns

### 1. **Repository Pattern** ✅ Already Implemented
**Location**: `app/repositories/base_repository.py`

**Purpose**: Abstracts data access logic and provides a collection-like interface for accessing domain objects.

**Benefits**:
- Separates data access from business logic
- Makes testing easier (can mock repositories)
- Centralizes data access logic

**Example**:
```python
class UserRepository(BaseRepository):
    def __init__(self, database):
        super().__init__(database, "users")
    
    async def get_by_email(self, email: str):
        return await self.find_one({"email": email})
```

---

### 2. **Factory Pattern** ✨ NEW
**Location**: `app/core/patterns/factory.py`

**Purpose**: Creates objects without specifying their exact classes.

**Benefits**:
- Centralizes object creation logic
- Makes code more flexible and maintainable
- Follows Open/Closed Principle

**Example**:
```python
# Create entities with default values
factory = EntityFactoryProvider.get_factory("user")
user = factory.create({
    "name": "John",
    "email": "john@example.com"
})
# Automatically adds: is_active, created_at, email_verified, etc.
```

**Usage in Code**:
```python
# In user service
from app.core.patterns.factory import EntityFactoryProvider

user_factory = EntityFactoryProvider.get_factory("user")
new_user = user_factory.create(user_data)
```

---

### 3. **Strategy Pattern** ✨ NEW
**Location**: `app/core/patterns/strategy.py`

**Purpose**: Defines a family of algorithms and makes them interchangeable.

**Benefits**:
- Flexible algorithm selection at runtime
- Eliminates conditional statements
- Easy to add new strategies

**Example**:
```python
# Email notification
email_strategy = EmailNotificationStrategy(email_service)
notifier = NotificationContext(email_strategy)
await notifier.notify("user@example.com", "Welcome", "Hello!")

# Switch to SMS
sms_strategy = SMSNotificationStrategy()
notifier.set_strategy(sms_strategy)
await notifier.notify("+1234567890", "Alert", "Important message")

# Payment processing
credit_card = CreditCardPaymentStrategy()
payment = PaymentContext(credit_card)
result = await payment.process(100.0, payment_details)

# Switch to bank transfer
bank_transfer = BankTransferPaymentStrategy()
payment.set_strategy(bank_transfer)
result = await payment.process(100.0, payment_details)
```

---

### 4. **Observer Pattern** ✨ NEW
**Location**: `app/core/patterns/observer.py`

**Purpose**: Defines a one-to-many dependency where observers are notified of state changes.

**Benefits**:
- Loose coupling between components
- Easy to add new observers
- Promotes event-driven architecture

**Example**:
```python
from app.core.patterns.observer import get_event_manager, EventType

# Get event manager (Singleton)
event_manager = get_event_manager()

# Emit events from anywhere in your code
await event_manager.emit(
    EventType.USER_REGISTERED,
    {"email": "user@example.com", "name": "John"}
)
# Automatically triggers: email, audit log, statistics

await event_manager.emit(
    EventType.BOOKING_CREATED,
    {"vendor_id": "123", "user_id": "456"}
)
# Automatically: notifies vendor, updates stats, logs audit
```

**Custom Observers**:
```python
from app.core.patterns.observer import Observer, Event

class CustomObserver(Observer):
    async def update(self, event: Event):
        # Custom logic
        print(f"Event received: {event.event_type.value}")

# Register custom observer
event_manager.subscribe(EventType.REVIEW_CREATED, CustomObserver())
```

---

### 5. **Builder Pattern** ✨ NEW
**Location**: `app/core/patterns/builder.py`

**Purpose**: Constructs complex objects step by step.

**Benefits**:
- Clear and readable object construction
- Validates data during construction
- Immutable once built

**Examples**:

#### Vendor Profile Builder:
```python
from app.core.patterns.builder import VendorProfileBuilder

vendor = (VendorProfileBuilder()
    .with_basic_info("ABC Catering", "abc@example.com", "+92123456")
    .with_location("123 Main St", "Karachi", "Sindh")
    .with_services("Catering", "Full service catering", ["Buffet", "BBQ"])
    .with_pricing("$$", [
        {"name": "Basic", "price": 50000},
        {"name": "Premium", "price": 100000}
    ])
    .with_media(["img1.jpg", "img2.jpg"])
    .with_social_media(
        facebook="facebook.com/abc",
        instagram="instagram.com/abc"
    )
    .build())
```

#### Booking Builder:
```python
from app.core.patterns.builder import BookingBuilder

booking = (BookingBuilder()
    .for_user("user123", "John Doe", "john@example.com")
    .for_vendor("vendor456", "ABC Catering")
    .with_service("service789", "Wedding Package")
    .on_date("2024-06-15")
    .with_pricing(100000, "PKR", 30000)
    .with_details("Wedding", 200, "Pearl Continental Hotel")
    .build())
```

#### Query Builder:
```python
from app.core.patterns.builder import QueryBuilder

query = (QueryBuilder()
    .where("category", "Catering")
    .where_gte("rating", 4.0)
    .where_in("city", ["Karachi", "Lahore"])
    .sort_by("rating", ascending=False)
    .limit(20)
    .build())

# Use in repository
vendors = await vendor_repo.find_many(query["filter"], query["skip"], query["limit"])
```

---

### 6. **Singleton Pattern** ✨ NEW
**Location**: `app/core/patterns/singleton.py`

**Purpose**: Ensures a class has only one instance throughout the application.

**Benefits**:
- Global access point
- Reduced memory usage
- Consistent state across application

**Examples**:

#### Application Configuration:
```python
from app.core.patterns.singleton import get_config

config = get_config()
config.set("max_upload_size", 10_000_000)
config.set("default_currency", "PKR")

# From anywhere in your code
config = get_config()  # Same instance
max_size = config.get("max_upload_size")
```

#### Cache Manager:
```python
from app.core.patterns.singleton import get_cache

cache = get_cache()

# Cache vendor data
cache.set("vendor:123", vendor_data, ttl=3600)  # 1 hour

# Retrieve from cache
vendor = cache.get("vendor:123")
if vendor is None:
    vendor = await get_from_db()
    cache.set("vendor:123", vendor, ttl=3600)
```

#### Request Counter (Rate Limiting):
```python
from app.core.patterns.singleton import get_request_counter

counter = get_request_counter()

# Track API requests
counter.increment(f"api:{user_id}")
count = counter.get_count(f"api:{user_id}")

if count > 100:  # Rate limit
    raise HTTPException(429, "Too many requests")
```

#### Metrics Collector:
```python
from app.core.patterns.singleton import get_metrics

metrics = get_metrics()

# Record response times
metrics.record_metric("api_response_time", 0.25)

# Count events
metrics.increment_counter("bookings_created")
metrics.increment_counter("failed_logins")

# Get statistics
stats = metrics.get_all_metrics()
# {
#   "metrics": {
#     "api_response_time": {"avg": 0.25, "count": 100, ...}
#   },
#   "counters": {
#     "bookings_created": 50,
#     "failed_logins": 5
#   }
# }
```

---

## Implementation Map

### Where Each Pattern is Used:

| Pattern | Files | Purpose |
|---------|-------|---------|
| **Repository** | `app/repositories/*.py` | Data access abstraction |
| **Service Layer** | `app/services/*.py` | Business logic separation |
| **Factory** | `app/core/patterns/factory.py` | Entity creation with defaults |
| **Strategy** | `app/core/patterns/strategy.py` | Notification & payment methods |
| **Observer** | `app/core/patterns/observer.py` | Event-driven notifications |
| **Builder** | `app/core/patterns/builder.py` | Complex object construction |
| **Singleton** | `app/core/patterns/singleton.py` | Config, cache, metrics |
| **Dependency Injection** | `app/api/dependencies.py` | Loose coupling |

---

## Benefits of This Architecture

### 1. **Maintainability** 📝
- Clear separation of concerns
- Easy to locate and fix bugs
- Self-documenting code structure

### 2. **Testability** 🧪
- Easy to mock dependencies
- Isolated unit testing
- Clear interfaces for testing

### 3. **Scalability** 📈
- Add new features without modifying existing code
- Plug-and-play components
- Horizontal scaling support

### 4. **Flexibility** 🔄
- Swap implementations easily
- Configure behavior at runtime
- Support multiple strategies

### 5. **Code Reusability** ♻️
- Common patterns across modules
- Reduce code duplication
- Standardized approaches

---

## How to Extend

### Adding a New Entity:

1. **Create Repository**:
```python
class NewEntityRepository(BaseRepository):
    def __init__(self, database):
        super().__init__(database, "new_entities")
```

2. **Create Service**:
```python
class NewEntityService:
    def __init__(self, repo: NewEntityRepository):
        self.repo = repo
```

3. **Register Factory**:
```python
class NewEntityFactory(EntityFactory):
    def create(self, data):
        return {**data, "created_at": datetime.utcnow()}

EntityFactoryProvider.register_factory("new_entity", NewEntityFactory)
```

4. **Add Event Types** (if needed):
```python
class EventType(Enum):
    NEW_ENTITY_CREATED = "new_entity_created"
```

### Adding a New Notification Method:

```python
class WhatsAppNotificationStrategy(NotificationStrategy):
    async def send(self, recipient, subject, message, data):
        # WhatsApp sending logic
        return True

# Use it
whatsapp = WhatsAppNotificationStrategy()
notifier = NotificationContext(whatsapp)
await notifier.notify("+92123456", "Alert", "Message")
```

---

## Best Practices

1. **Always use dependency injection** for services and repositories
2. **Use factories** when creating entities to ensure consistency
3. **Emit events** for important actions (user registered, booking created, etc.)
4. **Use builders** for complex object creation
5. **Cache frequently accessed data** using the CacheManager
6. **Track metrics** for monitoring and analytics
7. **Follow the repository pattern** for all data access
8. **Use strategies** for algorithms that may change

---

## Testing with Patterns

### Mocking Repositories:
```python
class MockUserRepository(IRepository):
    async def get_by_id(self, id):
        return {"id": id, "name": "Test User"}

# Inject in tests
service = UserService(MockUserRepository())
```

### Testing Observers:
```python
class TestObserver(Observer):
    def __init__(self):
        self.events_received = []
    
    async def update(self, event):
        self.events_received.append(event)

# In tests
test_observer = TestObserver()
event_manager.subscribe(EventType.TEST_EVENT, test_observer)
```

---

## Conclusion

This architecture provides:
- ✅ **Separation of Concerns** - Each component has a single responsibility
- ✅ **Loose Coupling** - Components depend on abstractions, not concrete implementations
- ✅ **High Cohesion** - Related functionality is grouped together
- ✅ **Testability** - Easy to test components in isolation
- ✅ **Maintainability** - Clear structure makes maintenance easier
- ✅ **Extensibility** - New features can be added without modifying existing code
- ✅ **Flexibility** - Components can be swapped and configured easily

This makes the codebase **professional**, **scalable**, and **enterprise-ready**! 🚀

