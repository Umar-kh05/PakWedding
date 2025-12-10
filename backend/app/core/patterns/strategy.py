"""
Strategy Pattern Implementation
Defines a family of algorithms, encapsulates each one, and makes them interchangeable
Following Open/Closed Principle and Dependency Inversion Principle
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class NotificationStrategy(ABC):
    """Abstract strategy for sending notifications"""
    
    @abstractmethod
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        """Send notification"""
        pass


class EmailNotificationStrategy(NotificationStrategy):
    """Strategy for email notifications"""
    
    def __init__(self, email_service):
        self.email_service = email_service
    
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        """Send email notification"""
        try:
            # Use the email service to send
            logger.info(f"Sending email to {recipient}: {subject}")
            # Actual email sending would be implemented here
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False


class SMSNotificationStrategy(NotificationStrategy):
    """Strategy for SMS notifications"""
    
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        """Send SMS notification"""
        try:
            logger.info(f"Sending SMS to {recipient}: {message[:50]}")
            # SMS sending logic would be implemented here
            return True
        except Exception as e:
            logger.error(f"Failed to send SMS: {str(e)}")
            return False


class PushNotificationStrategy(NotificationStrategy):
    """Strategy for push notifications"""
    
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        """Send push notification"""
        try:
            logger.info(f"Sending push notification to {recipient}")
            # Push notification logic would be implemented here
            return True
        except Exception as e:
            logger.error(f"Failed to send push notification: {str(e)}")
            return False


class NotificationContext:
    """
    Context class that uses a notification strategy
    Allows switching between different notification methods at runtime
    """
    
    def __init__(self, strategy: NotificationStrategy):
        self._strategy = strategy
    
    def set_strategy(self, strategy: NotificationStrategy):
        """Change notification strategy at runtime"""
        self._strategy = strategy
    
    async def notify(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        """Send notification using current strategy"""
        return await self._strategy.send(recipient, subject, message, data)


class PaymentStrategy(ABC):
    """Abstract strategy for payment processing"""
    
    @abstractmethod
    async def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        """Process payment"""
        pass
    
    @abstractmethod
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        """Refund payment"""
        pass


class CreditCardPaymentStrategy(PaymentStrategy):
    """Strategy for credit card payments"""
    
    async def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        """Process credit card payment"""
        logger.info(f"Processing credit card payment: ${amount}")
        # Credit card processing logic
        return {
            "success": True,
            "transaction_id": "CC_" + str(hash(str(payment_details))),
            "amount": amount,
            "method": "credit_card"
        }
    
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        """Refund credit card payment"""
        logger.info(f"Refunding credit card payment: {transaction_id}")
        return {
            "success": True,
            "refund_id": "REF_" + transaction_id,
            "amount": amount
        }


class BankTransferPaymentStrategy(PaymentStrategy):
    """Strategy for bank transfer payments"""
    
    async def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        """Process bank transfer payment"""
        logger.info(f"Processing bank transfer: ${amount}")
        return {
            "success": True,
            "transaction_id": "BT_" + str(hash(str(payment_details))),
            "amount": amount,
            "method": "bank_transfer"
        }
    
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        """Refund bank transfer"""
        logger.info(f"Refunding bank transfer: {transaction_id}")
        return {
            "success": True,
            "refund_id": "REF_" + transaction_id,
            "amount": amount
        }


class PaymentContext:
    """Context for payment processing"""
    
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy
    
    def set_strategy(self, strategy: PaymentStrategy):
        """Change payment strategy"""
        self._strategy = strategy
    
    async def process(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        """Process payment using current strategy"""
        return await self._strategy.process_payment(amount, payment_details)
    
    async def refund(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        """Refund payment using current strategy"""
        return await self._strategy.refund_payment(transaction_id, amount)

