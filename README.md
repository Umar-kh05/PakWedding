# 💍 PakWedding Portal

> A comprehensive wedding planning platform connecting couples with verified vendors across Pakistan

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

PakWedding Portal is a full-stack web application designed to simplify wedding planning in Pakistan. It connects couples with verified vendors across multiple categories including photography, catering, venues, decoration, and more. The platform features role-based access for users, vendors, and administrators with comprehensive booking management, reviews, favorites, and budget planning tools.

### Key Highlights

- **Clean Architecture** with clear separation of concerns
- **SOLID Principles** implementation throughout the codebase
- **Modern Tech Stack** with FastAPI and React
- **Type-Safe** development with TypeScript and Pydantic
- **Responsive Design** optimized for all devices
- **Real-time Updates** with efficient state management
- **Secure Authentication** using JWT tokens
- **Image Management** with Cloudinary integration
- **Email Notifications** for booking updates

## ✨ Features

### For Users (Couples)
- 👤 **User Registration & Authentication** - Secure account creation with password strength validation
- 🔐 **Strong Password Requirements** - Real-time password strength meter with validation feedback
- 🔑 **Password Reset** - Secure password recovery with email verification and token validation
- 🔔 **Toast Notifications** - Beautiful real-time feedback for all actions
- 🔍 **Advanced Vendor Search** - Filter by category, location, rating, and price
- 📅 **Booking Management** - Request, track, and manage vendor bookings
- ⭐ **Reviews & Ratings** - Share experiences and rate vendors
- ❤️ **Favorites** - Save and organize preferred vendors
- 💰 **Budget Planner** - Track wedding expenses by category
- ✅ **Wedding Checklist** - Stay organized with customizable to-do lists
- 📱 **Fully Responsive Design** - Mobile-first design optimized for all screen sizes

### For Vendors
- 🏪 **Vendor Registration** - Easy onboarding with approval workflow
- 📊 **Dashboard Analytics** - View bookings, revenue, and performance metrics
- 📦 **Package Management** - Create and manage service packages (Basic, Standard, Premium)
- 📸 **Gallery Management** - Upload and showcase work portfolio
- 🔔 **Booking Notifications** - Real-time alerts for new requests
- 💬 **Review Management** - View and respond to customer feedback
- 📈 **Revenue Tracking** - Monitor earnings and booking statistics

### For Administrators
- 🎛️ **Admin Dashboard** - Comprehensive platform overview
- ✅ **Vendor Approvals** - Review and approve vendor registrations
- 👥 **User Management** - Manage user accounts and permissions
- 🏆 **Admin Approvals** - Control admin account registrations
- 📊 **Platform Analytics** - Monitor overall system health and activity
- 🛡️ **Content Moderation** - Review and moderate vendor content

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI 0.115+
- **Language:** Python 3.10+
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Passlib with bcrypt
- **Password Validation:** Custom password strength validator
- **Email Service:** SMTP (Gmail integration)
- **Image Storage:** Cloudinary
- **Validation:** Pydantic v2
- **CORS:** FastAPI CORS middleware

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Notifications:** React Hot Toast
- **Icons:** Emoji & SVG
- **Form Handling:** React hooks

### Development Tools
- **API Documentation:** Swagger UI (FastAPI auto-generated)
- **Code Quality:** ESLint, Prettier
- **Version Control:** Git
- **Package Managers:** pip (Python), npm (Node.js)

## 🏗 Architecture

### Design Principles

The application follows **Clean Architecture** and **SOLID Principles**:

#### Backend Architecture (Layered)

```
┌─────────────────────────────────────┐
│         API Layer (Routes)          │  ← HTTP Endpoints
├─────────────────────────────────────┤
│       Service Layer (Business)      │  ← Business Logic
├─────────────────────────────────────┤
│    Repository Layer (Data Access)   │  ← Database Operations
├─────────────────────────────────────┤
│       Model Layer (Entities)        │  ← Data Structures
└─────────────────────────────────────┘
```

#### SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**
   - Each service handles one domain (e.g., `UserService`, `BookingService`)
   - Repositories are dedicated to specific entities
   - Clear separation between routes, services, and repositories

2. **Open/Closed Principle (OCP)**
   - `BaseRepository` can be extended without modification
   - Service classes designed for extension

3. **Liskov Substitution Principle (LSP)**
   - All repositories can substitute `BaseRepository`
   - Consistent interfaces across similar components

4. **Interface Segregation Principle (ISP)**
   - Focused repository interfaces per entity
   - Minimal, specific dependencies

5. **Dependency Inversion Principle (DIP)**
   - Services depend on repository abstractions
   - Dependency injection throughout
   - Database connection abstraction

## 🚀 Getting Started

### Prerequisites

- **Python 3.10 or higher**
- **Node.js 18 or higher**
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for image uploads)
- **Gmail Account** (for email notifications)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd pakwedding-portal/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file in backend directory:**
   ```env
   # Database
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME=pakwedding

   # Security
   SECRET_KEY=your-secret-key-min-32-characters
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=120

   # CORS
   BACKEND_CORS_ORIGINS=["http://localhost:3000"]

   # Cloudinary (Image Storage)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=PakWedding Portal
   FRONTEND_URL=http://localhost:3000
   ```

5. **Create admin user (optional):**
   ```bash
   python create_admin.py
   ```

6. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at:
   - **API**: http://localhost:8000
   - **Swagger Docs**: http://localhost:8000/docs
   - **ReDoc**: http://localhost:8000/redoc

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd pakwedding-portal/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in frontend directory (if needed):**
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at:
   - **Frontend**: http://localhost:3000

### First Steps

1. **Access the application** at http://localhost:3000
2. **Register a user account** or use the admin account created earlier
3. **Explore vendors** on the vendors page
4. **Register as a vendor** (requires admin approval)
5. **Admin login** at `/admin/login` to approve vendors

## 📁 Project Structure

```
pakwedding-portal/
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── dependencies.py
│   │   │   └── routes/
│   │   │       ├── auth.py           # Authentication endpoints
│   │   │       ├── users.py          # User management
│   │   │       ├── vendors.py        # Vendor operations
│   │   │       ├── bookings.py       # Booking management
│   │   │       ├── reviews.py        # Review system
│   │   │       ├── favorites.py      # User favorites
│   │   │       ├── checklist.py      # Wedding checklist
│   │   │       ├── admin.py          # Admin operations
│   │   │       ├── services.py       # Service catalog
│   │   │       ├── uploads.py        # File uploads
│   │   │       └── vendor_bookings.py
│   │   │
│   │   ├── core/              # Core Utilities
│   │   │   ├── config.py            # App configuration
│   │   │   ├── database.py          # MongoDB connection
│   │   │   ├── security.py          # Auth & encryption
│   │   │   ├── constants.py         # App constants
│   │   │   └── exceptions.py        # Custom exceptions
│   │   │
│   │   ├── models/            # Pydantic Models
│   │   │   ├── user.py              # User schemas
│   │   │   ├── vendor.py            # Vendor schemas
│   │   │   ├── booking.py           # Booking schemas
│   │   │   ├── review.py            # Review schemas
│   │   │   ├── favorite.py          # Favorite schemas
│   │   │   ├── checklist.py         # Checklist schemas
│   │   │   ├── service.py           # Service schemas
│   │   │   └── package.py           # Package schemas
│   │   │
│   │   ├── repositories/      # Data Access Layer
│   │   │   ├── base_repository.py   # Base CRUD operations
│   │   │   ├── user_repository.py
│   │   │   ├── vendor_repository.py
│   │   │   ├── booking_repository.py
│   │   │   ├── review_repository.py
│   │   │   ├── favorite_repository.py
│   │   │   ├── service_repository.py
│   │   │   └── checklist_repository.py
│   │   │
│   │   └── services/          # Business Logic Layer
│   │       ├── user_service.py
│   │       ├── vendor_service.py
│   │       ├── booking_service.py
│   │       ├── review_service.py
│   │       ├── favorite_service.py
│   │       ├── checklist_service.py
│   │       ├── cloudinary_service.py
│   │       ├── email_service.py
│   │       └── vendor_stats_service.py
│   │
│   ├── uploads/               # Local file storage
│   │   ├── users/
│   │   └── vendors/
│   │
│   ├── main.py                # Application entry point
│   ├── create_admin.py        # Admin creation script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (create this)
│
└── frontend/                  # React TypeScript Frontend
    ├── src/
    │   ├── components/        # Reusable Components
    │   │   ├── Layout.tsx           # Main layout wrapper
    │   │   ├── Navbar.tsx           # Navigation bar
    │   │   ├── Footer.tsx           # Footer component
    │   │   ├── Sidebar.tsx          # Dashboard sidebar
    │   │   ├── ProtectedRoute.tsx   # Auth guard
    │   │   ├── BookingModal.tsx     # Booking dialog
    │   │   └── ReviewModal.tsx      # Review dialog
    │   │
    │   ├── pages/             # Page Components
    │   │   ├── HomePage.tsx
    │   │   ├── AboutPage.tsx
    │   │   ├── ContactPage.tsx
    │   │   ├── BudgetPlannerPage.tsx
    │   │   ├── ChecklistPage.tsx
    │   │   ├── FavoritesPage.tsx
    │   │   ├── UserReviewsPage.tsx
    │   │   ├── auth/
    │   │   │   ├── LoginPage.tsx
    │   │   │   ├── RegisterPage.tsx
    │   │   │   ├── VendorRegisterPage.tsx
    │   │   │   ├── AdminLoginPage.tsx
    │   │   │   ├── ForgotPasswordPage.tsx
    │   │   │   └── ResetPasswordPage.tsx
    │   │   ├── user/
    │   │   │   └── UserDashboard.tsx
    │   │   ├── vendor/
    │   │   │   ├── VendorDashboard.tsx
    │   │   │   ├── VendorProfilePage.tsx
    │   │   │   ├── VendorBookingsPage.tsx
    │   │   │   ├── VendorPackagesPage.tsx
    │   │   │   └── VendorReviewsPage.tsx
    │   │   ├── vendors/
    │   │   │   ├── BrowseVendorsPage.tsx
    │   │   │   └── VendorProfilePage.tsx
    │   │   ├── bookings/
    │   │   │   ├── BookingPage.tsx
    │   │   │   └── BookingHistoryPage.tsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.tsx
    │   │       ├── VendorApprovalsPage.tsx
    │   │       ├── AdminApprovalsPage.tsx
    │   │       ├── UserManagementPage.tsx
    │   │       ├── ReviewModerationPage.tsx
    │   │       └── AddVendorPage.tsx
    │   │
    │   ├── services/          # API Service Layer
    │   │   ├── api.ts               # Axios instance
    │   │   ├── authService.ts
    │   │   ├── userService.ts
    │   │   ├── vendorService.ts
    │   │   ├── bookingService.ts
    │   │   └── reviewService.ts
    │   │
    │   ├── store/             # State Management
    │   │   └── authStore.ts         # Zustand auth store
    │   │
    │   ├── config/            # Configuration
    │   │   └── vendorImages.ts      # Image mappings
    │   │
    │   ├── App.tsx            # Root component
    │   ├── main.tsx           # Application entry
    │   └── index.css          # Global styles
    │
    ├── index.html             # HTML template
    ├── package.json           # Node dependencies
    ├── tsconfig.json          # TypeScript config
    ├── vite.config.ts         # Vite config
    ├── tailwind.config.js     # Tailwind config
    └── postcss.config.js      # PostCSS config
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/check-email` | Check if email exists | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/verify-reset-token` | Verify password reset token | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user profile | Yes |
| PUT | `/api/users/me` | Update user profile | Yes |
| POST | `/api/users/me/password` | Change password | Yes |

### Vendor Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/vendors/register` | Register as vendor | No |
| GET | `/api/vendors` | List all vendors | No |
| GET | `/api/vendors/{id}` | Get vendor details | No |
| GET | `/api/vendors/me` | Get current vendor profile | Yes (Vendor) |
| PUT | `/api/vendors/me` | Update vendor profile | Yes (Vendor) |
| GET | `/api/vendors/me/stats` | Get vendor statistics | Yes (Vendor) |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create new booking | Yes |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes |
| GET | `/api/bookings/vendor/bookings` | Get vendor's bookings | Yes (Vendor) |
| GET | `/api/bookings/{id}` | Get booking details | Yes |
| PUT | `/api/bookings/{id}/status` | Update booking status | Yes (Vendor) |
| DELETE | `/api/bookings/{id}` | Cancel booking | Yes |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reviews` | Create review | Yes |
| GET | `/api/reviews/vendor/{vendor_id}` | Get vendor reviews | No |
| GET | `/api/reviews/my-reviews` | Get user's reviews | Yes |
| PUT | `/api/reviews/{id}` | Update review | Yes |
| DELETE | `/api/reviews/{id}` | Delete review | Yes |

### Favorites Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/favorites` | Add to favorites | Yes |
| GET | `/api/favorites` | Get user favorites | Yes |
| DELETE | `/api/favorites/{vendor_id}` | Remove from favorites | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/vendors/pending` | Get pending vendors | Yes (Admin) |
| POST | `/api/admin/vendors/{id}/approve` | Approve vendor | Yes (Admin) |
| POST | `/api/admin/vendors/{id}/reject` | Reject vendor | Yes (Admin) |
| GET | `/api/admin/users/pending-admins` | Get pending admins | Yes (Admin) |
| POST | `/api/admin/users/{id}/approve-admin` | Approve admin | Yes (Admin) |
| GET | `/api/admin/stats` | Get platform statistics | Yes (Admin) |

### File Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/uploads/vendor/image` | Upload vendor image | Yes (Vendor) |
| POST | `/api/uploads/vendor/gallery` | Upload gallery image | Yes (Vendor) |
| DELETE | `/api/uploads/vendor/gallery/{filename}` | Delete gallery image | Yes (Vendor) |

For complete API documentation with request/response schemas, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | MongoDB connection string | Yes | - |
| `DATABASE_NAME` | MongoDB database name | Yes | pakwedding |
| `SECRET_KEY` | JWT secret key (min 32 chars) | Yes | - |
| `ALGORITHM` | JWT algorithm | No | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | No | 120 |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins (JSON array) | Yes | ["http://localhost:3000"] |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `SMTP_HOST` | SMTP server hostname | Yes | smtp.gmail.com |
| `SMTP_PORT` | SMTP server port | Yes | 587 |
| `SMTP_USER` | SMTP username/email | Yes | - |
| `SMTP_PASSWORD` | SMTP password/app password | Yes | - |
| `SMTP_FROM_EMAIL` | Sender email address | Yes | - |
| `SMTP_FROM_NAME` | Sender display name | Yes | PakWedding Portal |
| `FRONTEND_URL` | Frontend application URL | Yes | http://localhost:3000 |

### Service Categories

The platform supports the following vendor categories:
- Photography
- Videography
- Caterer
- Decorator
- Venue
- Makeup Artist
- Mehndi
- DJ
- Florist

### Booking Statuses

- `pending` - Initial booking request
- `confirmed` - Accepted by vendor
- `completed` - Service delivered
- `cancelled` - Cancelled by user or vendor
- `rejected` - Declined by vendor

## 🚢 Deployment

### Backend Deployment (FastAPI)

1. **Install production dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables** for production

3. **Run with production server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

   Or use **Gunicorn**:
   ```bash
   gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

### Frontend Deployment (React)

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the built files** using:
   - Nginx
   - Apache
   - Vercel
   - Netlify
   - Any static file hosting service

3. **Update environment variables** for production API URL

### Recommended Hosting Platforms

- **Backend**: Railway, Render, Heroku, AWS, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: MongoDB Atlas (free tier available)
- **Images**: Cloudinary (free tier available)

## 👨‍💻 Development

### Code Style

- **Python**: Follow PEP 8 style guide
- **TypeScript**: Use ESLint and Prettier
- **Commits**: Follow conventional commit messages

### Adding New Features

1. **Backend**:
   - Create model in `app/models/`
   - Create repository in `app/repositories/`
   - Create service in `app/services/`
   - Add routes in `app/api/routes/`
   - Update dependencies in `app/api/dependencies.py`

2. **Frontend**:
   - Create page in `src/pages/`
   - Add API service in `src/services/`
   - Update routes in `App.tsx`
   - Add components in `src/components/`

### Testing

**Backend:**
```bash
cd backend
pytest tests/
```

**Frontend:**
```bash
cd frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- Code follows the project's style guidelines
- All tests pass
- Documentation is updated
- Commit messages are clear and descriptive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- FastAPI for the excellent Python web framework
- React team for the powerful UI library
- MongoDB for the flexible database
- Cloudinary for image management
- All contributors and supporters

## 📞 Support

For support, email abdulraheemghauri@gmail.com or open an issue in the repository.

---

<div align="center">

**Made with ❤️ for weddings in Pakistan**

[⬆ Back to Top](#-pakwedding-portal)

</div>
