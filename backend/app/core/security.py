from datetime import datetime, timedelta, timezone
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
    
    # Use timezone-aware UTC datetime
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Convert datetime to Unix timestamp (seconds since epoch)
    expire_timestamp = int(expire.timestamp())
    to_encode.update({"exp": expire_timestamp})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    print(f"[AUTH] Token created at: {now}, expires at: {expire} (timestamp: {expire_timestamp}, expires in {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes)")
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token"""
    try:
        # Add 60 seconds leeway for clock skew
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"leeway": 60})
        return payload
    except JWTError as e:
        # Log the specific error for debugging
        print(f"[AUTH ERROR] Token validation failed: {type(e).__name__}: {str(e)}")
        # Log token expiration details if it's an expiration error
        if "expired" in str(e).lower() or "ExpiredSignature" in str(type(e).__name__):
            try:
                # Decode without verification to see the expiration
                unverified = jwt.decode(token, options={"verify_signature": False})
                exp_timestamp = unverified.get("exp")
                if exp_timestamp:
                    from datetime import datetime
                    exp_time = datetime.fromtimestamp(exp_timestamp)
                    now = datetime.utcnow()
                    print(f"[AUTH ERROR] Token expired. Current time: {now}, Token expires: {exp_time}, Difference: {(now.timestamp() - exp_timestamp) / 60:.2f} minutes")
            except:
                pass
        return None
