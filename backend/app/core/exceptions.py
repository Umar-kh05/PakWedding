from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class NotFoundException(BaseAPIException):
    def __init__(self, resource: str = "Resource"):
        super().__init__(
            detail=f"{resource} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedException(BaseAPIException):
    def __init__(self, detail: str = "Not authorized to perform this action"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenException(BaseAPIException):
    def __init__(self, detail: str = "Not enough permissions"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_403_FORBIDDEN
        )


class ValidationException(BaseAPIException):
    def __init__(self, detail: str):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )


class ConflictException(BaseAPIException):
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_409_CONFLICT
        )


class BadRequestException(BaseAPIException):
    def __init__(self, detail: str):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class UserNotFoundException(NotFoundException):
    def __init__(self):
        super().__init__(resource="User")


class VendorNotFoundException(NotFoundException):
    def __init__(self):
        super().__init__(resource="Vendor")


class BookingNotFoundException(NotFoundException):
    def __init__(self):
        super().__init__(resource="Booking")


class ReviewNotFoundException(NotFoundException):
    def __init__(self):
        super().__init__(resource="Review")


class InvalidCredentialsException(UnauthorizedException):
    def __init__(self):
        super().__init__(detail="Invalid email or password")


class AccountInactiveException(ForbiddenException):
    def __init__(self):
        super().__init__(detail="Your account has been deactivated. Please contact an administrator.")


class AdminNotApprovedException(ForbiddenException):
    def __init__(self):
        super().__init__(detail="Admin account pending approval")


class EmailAlreadyExistsException(ConflictException):
    def __init__(self):
        super().__init__(detail="User with this email already exists")


class WeakPasswordException(ValidationException):
    def __init__(self, min_length: int = 6):
        super().__init__(detail=f"Password must be at least {min_length} characters long")


class IncorrectPasswordException(UnauthorizedException):
    def __init__(self):
        super().__init__(detail="Incorrect password")

