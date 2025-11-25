"""
FastAPI main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, vendors, bookings, admin, services
from app.core.config import settings

app = FastAPI(
    title="PakWedding Portal API",
    description="Wedding planning portal backend with vendor management",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(vendors.router, prefix="/api/vendors", tags=["Vendors"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "PakWedding Portal API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

