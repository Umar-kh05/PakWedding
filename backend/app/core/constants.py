"""
Application constants
Centralizes magic numbers and strings for better maintainability
"""

# Pagination
DEFAULT_SKIP = 0
DEFAULT_LIMIT = 100
MAX_LIMIT = 1000
VENDOR_LIST_LIMIT = 200

# Password
MIN_PASSWORD_LENGTH = 6
MAX_PASSWORD_LENGTH = 128

# Token
TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS = 30

# User Roles
ROLE_CUSTOMER = "customer"
ROLE_VENDOR = "vendor"
ROLE_ADMIN = "admin"

# Booking Status
BOOKING_STATUS_PENDING = "pending"
BOOKING_STATUS_APPROVED = "approved"
BOOKING_STATUS_CONFIRMED = "confirmed"
BOOKING_STATUS_COMPLETED = "completed"
BOOKING_STATUS_CANCELLED = "cancelled"
BOOKING_STATUS_REJECTED = "rejected"

# Review Rating
MIN_RATING = 1
MAX_RATING = 5

# File Upload
MAX_FILE_SIZE_MB = 10
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
UPLOAD_DIR_USERS = "uploads/users"
UPLOAD_DIR_VENDORS = "uploads/vendors"

# Vendor Categories
VENDOR_CATEGORIES = [
    "Venue",
    "Catering",
    "Photography",
    "Videography",
    "Decoration",
    "Makeup",
    "Music",
    "Transportation",
    "Invitation",
    "Other"
]

# Checklist Categories
CHECKLIST_CATEGORIES = [
    "Venue",
    "Catering",
    "Decoration",
    "Photography",
    "Attire",
    "Invitations",
    "Entertainment",
    "Transportation",
    "Miscellaneous"
]

# Priority Levels
PRIORITY_LOW = "low"
PRIORITY_MEDIUM = "medium"
PRIORITY_HIGH = "high"

# Error Messages
ERROR_USER_NOT_FOUND = "User not found"
ERROR_VENDOR_NOT_FOUND = "Vendor not found"
ERROR_BOOKING_NOT_FOUND = "Booking not found"
ERROR_UNAUTHORIZED = "Not authorized to perform this action"
ERROR_INVALID_CREDENTIALS = "Invalid email or password"
ERROR_EMAIL_EXISTS = "User with this email already exists"
ERROR_WEAK_PASSWORD = f"Password must be at least {MIN_PASSWORD_LENGTH} characters long"
ERROR_INVALID_TOKEN = "Could not validate credentials"
ERROR_ACCOUNT_INACTIVE = "Your account has been deactivated"
ERROR_ADMIN_NOT_APPROVED = "Admin account pending approval"

# Success Messages
SUCCESS_USER_CREATED = "User created successfully"
SUCCESS_VENDOR_REGISTERED = "Vendor registered successfully. Pending admin approval."
SUCCESS_BOOKING_CREATED = "Booking created successfully"
SUCCESS_REVIEW_CREATED = "Review submitted successfully"
SUCCESS_PASSWORD_UPDATED = "Password updated successfully"

