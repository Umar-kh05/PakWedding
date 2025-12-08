"""
Custom exceptions for better error handling
Following Single Responsibility Principle - each exception has one purpose
"""
from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    """Base exception for all API exceptions"""
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class NotFoundException(BaseAPIException):
    """Resource not found exception"""
    def __init__(self, resource: str = "Resource"):
        super().__init__(
            detail=f"{resource} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedException(BaseAPIException):
    """Unauthorized access exception"""
    def __init__(self, detail: str = "Not authorized to perform this action"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenException(BaseAPIException):
    """Forbidden access exception"""
    def __init__(self, detail: str = "Not enough permissions"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_403_FORBIDDEN
        )


class ValidationException(BaseAPIException):
    """Validation error exception"""
    def __init__(self, detail: str):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )


class ConflictException(BaseAPIException):
    """Resource conflict exception"""
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_409_CONFLICT
        )


class BadRequestException(BaseAPIException):
    """Bad request exception"""
    def __init__(self, detail: str):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_400_BAD_REQUEST
        )


# Specific domain exceptions
class UserNotFoundException(NotFoundException):
    """User not found exception"""
    def __init__(self):
        super().__init__(resource="User")


class VendorNotFoundException(NotFoundException):
    """Vendor not found exception"""
    def __init__(self):
        super().__init__(resource="Vendor")


class BookingNotFoundException(NotFoundException):
    """Booking not found exception"""
    def __init__(self):
        super().__init__(resource="Booking")


class ReviewNotFoundException(NotFoundException):
    """Review not found exception"""
    def __init__(self):
        super().__init__(resource="Review")


class InvalidCredentialsException(UnauthorizedException):
    """Invalid credentials exception"""
    def __init__(self):
        super().__init__(detail="Invalid email or password")


class AccountInactiveException(ForbiddenException):
    """Account inactive exception"""
    def __init__(self):
        super().__init__(detail="Your account has been deactivated. Please contact an administrator.")


class AdminNotApprovedException(ForbiddenException):
    """Admin not approved exception"""
    def __init__(self):
        super().__init__(detail="Admin account pending approval")


class EmailAlreadyExistsException(ConflictException):
    """Email already exists exception"""
    def __init__(self):
        super().__init__(detail="User with this email already exists")


class WeakPasswordException(ValidationException):
    """Weak password exception"""
    def __init__(self, min_length: int = 6):
        super().__init__(detail=f"Password must be at least {min_length} characters long")


class IncorrectPasswordException(UnauthorizedException):
    """Incorrect password exception"""
    def __init__(self):
        super().__init__(detail="Incorrect password")

