# PakWedding Portal

A full-stack wedding planning portal built with **FastAPI** (backend) and **React + TypeScript** (frontend), following **SOLID principles** and **Clean Architecture**.

## Project Structure

```
pakwedding-portal/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Core utilities (config, security, database)
│   │   ├── models/       # Pydantic models
│   │   ├── repositories/ # Data access layer
│   │   └── services/     # Business logic layer
│   ├── main.py           # FastAPI entry point
│   └── requirements.txt  # Python dependencies
│
└── frontend/             # React + TypeScript frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API service layer
    │   └── store/        # State management (Zustand)
    ├── package.json
    └── vite.config.ts
```

## Backend Setup (FastAPI + Python)

### Prerequisites
- Python 3.10+
- MongoDB

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Update `.env` with your MongoDB connection and secret key.

### Running the Backend

```bash
uvicorn main:app --reload --port 8000
```

API will be available at: `http://localhost:8000`
API docs (Swagger): `http://localhost:8000/docs`

## Frontend Setup (React + TypeScript)

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Running the Frontend

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Architecture & SOLID Principles

### Backend Architecture

**Layers:**
1. **API Layer** (`app/api/routes/`) - HTTP endpoints
2. **Service Layer** (`app/services/`) - Business logic
3. **Repository Layer** (`app/repositories/`) - Data access
4. **Model Layer** (`app/models/`) - Data structures

**SOLID Principles Applied:**

- **Single Responsibility Principle (SRP)**: Each class/module has one responsibility
  - `UserService` handles user business logic
  - `UserRepository` handles user data access
  - `PasswordHasher` handles password operations

- **Open/Closed Principle (OCP)**: Classes are open for extension, closed for modification
  - `BaseRepository` can be extended by specific repositories

- **Liskov Substitution Principle (LSP)**: Derived classes can substitute base classes
  - All repositories extend `BaseRepository` and can be used interchangeably

- **Interface Segregation Principle (ISP)**: Clients depend only on interfaces they use
  - `IRepository` defines minimal interface for data access

- **Dependency Inversion Principle (DIP)**: Depend on abstractions, not concretions
  - Services depend on repository interfaces, not implementations
  - Dependency injection used throughout

### Frontend Architecture

- **Component-based** architecture with React
- **State management** with Zustand
- **API layer** abstraction with Axios
- **Type safety** with TypeScript
- **Styling** with Tailwind CSS

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

### Vendors
- `POST /api/vendors/register` - Register as vendor
- `GET /api/vendors` - List vendors
- `GET /api/vendors/{id}` - Get vendor details
- `PUT /api/vendors/me` - Update vendor profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking
- `POST /api/bookings/{id}/cancel` - Cancel booking

### Admin
- `GET /api/admin/vendors/pending` - Get pending vendor approvals
- `POST /api/admin/vendors/{id}/approve` - Approve vendor

## Features

- ✅ User registration and authentication
- ✅ Vendor registration and approval workflow
- ✅ Service browsing and booking
- ✅ User, Vendor, and Admin dashboards
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ MongoDB database integration
- ✅ RESTful API design
- ✅ Clean Architecture
- ✅ SOLID principles

## Development

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Build for Production

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
```

## License

MIT

