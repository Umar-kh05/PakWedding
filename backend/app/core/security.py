from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import hashlib
import os
import base64
from app.core.config import settings


def hash_password(password: str) -> str:
    salt = base64.b64encode(os.urandom(32)).decode('utf-8')
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}:{base64.b64encode(key).decode('utf-8')}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt, key = hashed_password.split(':')
        new_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return base64.b64encode(new_key).decode('utf-8') == key
    except:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Convert datetime to Unix timestamp (seconds since epoch)
    expire_timestamp = int(expire.timestamp())
    to_encode.update({"exp": expire_timestamp})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    print(f"[AUTH] Token created, expires at: {expire} (timestamp: {expire_timestamp})")
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        # Log the specific error for debugging
        print(f"[AUTH ERROR] Token validation failed: {type(e).__name__}: {str(e)}")
        return None
