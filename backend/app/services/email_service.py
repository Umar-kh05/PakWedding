import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from app.core.config import settings
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
        self.from_name = settings.SMTP_FROM_NAME

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        
        try:

            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email

            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)

            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                start_tls=True,
            )

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_password_reset_email(
        self,
        to_email: str,
        reset_token: str,
        user_name: Optional[str] = None
    ) -> bool:
        
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"



        template = Template(html_template)
        html_content = template.render(
            reset_link=reset_link,
            user_name=user_name
        )

        return await self.send_email(
            to_email=to_email,
            subject="Reset Your Password - PakWedding Portal",
            html_content=html_content,
            text_content=text_content
        )

    async def send_welcome_email(
        self,
        to_email: str,
        user_name: str,
        user_role: str = "user"
    ) -> bool:
        


        template = Template(html_template)
        html_content = template.render(
            user_name=user_name,
            user_role=user_role,
            frontend_url=settings.FRONTEND_URL
        )

        return await self.send_email(
            to_email=to_email,
            subject="Welcome to PakWedding Portal! 🎉",
            html_content=html_content
        )

email_service = EmailService()
