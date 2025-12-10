from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class NotificationStrategy(ABC):
    
    @abstractmethod
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        pass


class EmailNotificationStrategy(NotificationStrategy):
    
    def __init__(self, email_service):
        self.email_service = email_service
    
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        try:
            logger.info(f"Sending email to {recipient}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False


class SMSNotificationStrategy(NotificationStrategy):
    
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        try:
            logger.info(f"Sending SMS to {recipient}: {message[:50]}")
            return True
        except Exception as e:
            logger.error(f"Failed to send SMS: {str(e)}")
            return False


class PushNotificationStrategy(NotificationStrategy):
    
    async def send(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        try:
            logger.info(f"Sending push notification to {recipient}")
            return True
        except Exception as e:
            logger.error(f"Failed to send push notification: {str(e)}")
            return False


class NotificationContext:
    
    def __init__(self, strategy: NotificationStrategy):
        self._strategy = strategy
    
    def set_strategy(self, strategy: NotificationStrategy):
        self._strategy = strategy
    
    async def notify(self, recipient: str, subject: str, message: str, data: Optional[Dict[str, Any]] = None) -> bool:
        return await self._strategy.send(recipient, subject, message, data)


class PaymentStrategy(ABC):
    
    @abstractmethod
    async def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        pass


class CreditCardPaymentStrategy(PaymentStrategy):
    
    async def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"Processing credit card payment: ${amount}")
        return {
            "success": True,
            "transaction_id": "CC_" + str(hash(str(payment_details))),
            "amount": amount,
            "method": "credit_card"
        }
    
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        logger.info(f"Refunding credit card payment: {transaction_id}")
        return {
            "success": True,
            "refund_id": "REF_" + transaction_id,
            "amount": amount
        }


class BankTransferPaymentStrategy(PaymentStrategy):
    
    async def process_payment(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"Processing bank transfer: ${amount}")
        return {
            "success": True,
            "transaction_id": "BT_" + str(hash(str(payment_details))),
            "amount": amount,
            "method": "bank_transfer"
        }
    
    async def refund_payment(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        logger.info(f"Refunding bank transfer: {transaction_id}")
        return {
            "success": True,
            "refund_id": "REF_" + transaction_id,
            "amount": amount
        }


class PaymentContext:
    
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy
    
    def set_strategy(self, strategy: PaymentStrategy):
        self._strategy = strategy
    
    async def process(self, amount: float, payment_details: Dict[str, Any]) -> Dict[str, Any]:
        return await self._strategy.process_payment(amount, payment_details)
    
    async def refund(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        return await self._strategy.refund_payment(transaction_id, amount)

