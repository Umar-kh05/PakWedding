"""
Password strength validator
Checks password against common security requirements
"""
import re
from typing import Tuple, List


class PasswordStrength:
    """Password strength levels"""
    WEAK = "weak"
    MODERATE = "moderate"
    STRONG = "strong"
    VERY_STRONG = "very_strong"


def validate_password_strength(password: str) -> Tuple[str, List[str], bool]:
    """
    Validate password strength and return feedback
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (strength_level, issues, is_valid)
    """
    issues = []
    score = 0
    
    # Check minimum length
    if len(password) < 8:
        issues.append("Password must be at least 8 characters long")
    else:
        score += 1
        
    # Check for uppercase letters
    if not re.search(r'[A-Z]', password):
        issues.append("Password must contain at least one uppercase letter")
    else:
        score += 1
        
    # Check for lowercase letters
    if not re.search(r'[a-z]', password):
        issues.append("Password must contain at least one lowercase letter")
    else:
        score += 1
        
    # Check for digits
    if not re.search(r'\d', password):
        issues.append("Password must contain at least one number")
    else:
        score += 1
        
    # Check for special characters
    if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;\'`~]', password):
        issues.append("Password must contain at least one special character (!@#$%^&* etc.)")
    else:
        score += 1
        
    # Check for common passwords
    common_passwords = [
        'password', '123456', '12345678', 'qwerty', 'abc123', 
        'password123', '123456789', '12345', '1234567', 'password1'
    ]
    if password.lower() in common_passwords:
        issues.append("Password is too common. Please choose a more unique password")
        score = 0
        
    # Check for sequential characters
    if re.search(r'(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)', password.lower()):
        issues.append("Avoid using sequential characters")
        score = max(0, score - 1)
        
    # Check for repeated characters
    if re.search(r'(.)\1{2,}', password):
        issues.append("Avoid using repeated characters")
        score = max(0, score - 1)
    
    # Determine strength level
    if score >= 5:
        strength = PasswordStrength.VERY_STRONG
    elif score >= 4:
        strength = PasswordStrength.STRONG
    elif score >= 3:
        strength = PasswordStrength.MODERATE
    else:
        strength = PasswordStrength.WEAK
        
    # Password is valid if it has no critical issues
    is_valid = len(issues) == 0 or (score >= 4 and len(issues) <= 1)
    
    return strength, issues, is_valid


def get_password_requirements() -> List[str]:
    """
    Get list of password requirements
    
    Returns:
        List of password requirements
    """
    return [
        "At least 8 characters long",
        "Contains uppercase letter (A-Z)",
        "Contains lowercase letter (a-z)",
        "Contains number (0-9)",
        "Contains special character (!@#$%^&* etc.)",
        "Not a common password"
    ]

