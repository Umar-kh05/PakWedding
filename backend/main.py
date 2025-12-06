"""
FastAPI main application entry point
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.api.routes import auth, users, vendors, bookings, admin, services, uploads, vendor_bookings, reviews
from app.core.config import settings
from app.core.database import Database

app = FastAPI(
    title="PakWedding Portal API",
    description="Wedding planning portal backend with vendor management",
    version="1.0.0"
)

# Add validation error handler for better error messages
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with detailed messages"""
    errors = exc.errors()
    error_details = []
    for error in errors:
        field = ".".join(str(loc) for loc in error.get("loc", []))
        message = error.get("msg", "Validation error")
        error_details.append(f"{field}: {message}")
    
    error_message = "; ".join(error_details)
    print(f"[VALIDATION ERROR] {error_message}")
    print(f"[VALIDATION ERROR] Full error: {errors}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": error_message, "errors": errors}
    )

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server (Vite default: 5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection events
@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    await Database.connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    await Database.close_db()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(vendors.router, prefix="/api/vendors", tags=["Vendors"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["Uploads"])
app.include_router(vendor_bookings.router, prefix="/api/vendor", tags=["Vendor Bookings"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])

@app.get("/")
async def root():
    return {"message": "PakWedding Portal API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

