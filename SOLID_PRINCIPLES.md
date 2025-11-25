# SOLID Principles Implementation

## 1. Single Responsibility Principle (SRP)
Each class/module has one reason to change:
- **Models**: User.ts, Service.ts, Booking.ts, Review.ts, Budget.ts, Favorite.ts
- **Services**: UserService, VendorService, BookingService, etc. (each handles one domain)
- **Repositories**: Separate repository for each entity
- **Controllers**: Separate controller for each feature area

## 2. Open/Closed Principle (OCP)
Open for extension, closed for modification:
- **BaseRepository**: Can be extended without modifying
- **User inheritance**: Customer, Vendor, Admin extend User
- **Interfaces**: IRepository, IUserRepository, IVendorRepository can be implemented differently

## 3. Liskov Substitution Principle (LSP)
Subclasses are substitutable for base classes:
- **User hierarchy**: Customer, Vendor, Admin can all replace User
- **Repository implementations**: Any IRepository implementation can replace another

## 4. Interface Segregation Principle (ISP)
Many specific interfaces instead of one general:
- **IRepository**: Base interface
- **IUserRepository**: User-specific methods
- **IVendorRepository**: Vendor-specific methods
- **IBookingRepository**: Booking-specific methods

## 5. Dependency Inversion Principle (DIP)
Depend on abstractions, not concretions:
- **Services depend on Repository Interfaces** (IRepository), not concrete classes
- **Controllers depend on Services**, not repositories directly
- **Dependency Injection** throughout the application

## Design Patterns

### Repository Pattern
- All data access goes through repositories
- Business logic doesn't know about database

### MVC Pattern
- **Models**: Domain entities
- **Views**: EJS templates
- **Controllers**: Request handlers

### Factory Pattern
- User creation based on role (Customer, Vendor, Admin)

### State Pattern
- Booking status transitions (pending → confirmed → completed)

### Middleware Pattern
- authMiddleware, roleMiddleware, errorHandler

