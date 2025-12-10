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

        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #D97706; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 30px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #D97706; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>PakWedding Portal</h1>
                </div>
                <div class="content">
                    <h2>Password Reset Request</h2>
                    {% if user_name %}
                    <p>Hello {{ user_name }},</p>
                    {% else %}
                    <p>Hello,</p>
                    {% endif %}
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    <a href="{{ reset_link }}" class="button">Reset Password</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #D97706;">{{ reset_link }}</p>
                    <p><strong>This link will expire in 30 minutes.</strong></p>
                    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 PakWedding Portal. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        text_content = f"""
        PakWedding Portal - Password Reset Request
        
        Hello{' ' + user_name if user_name else ''},
        
        We received a request to reset your password. Click the link below to reset it:
        
        {reset_link}
        
        This link will expire in 30 minutes.
        
        If you didn't request a password reset, please ignore this email.
        
        Best regards,
        PakWedding Portal Team
        """

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
        

        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #D97706; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9f9f9; padding: 30px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #D97706; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to PakWedding Portal! 🎉</h1>
                </div>
                <div class="content">
                    <h2>Hello {{ user_name }}!</h2>
                    <p>Thank you for registering with PakWedding Portal.</p>
                    {% if user_role == 'vendor' %}
                    <p>Your vendor account has been created successfully. Once approved by our admin team, you'll be able to showcase your services to couples planning their perfect wedding.</p>
                    {% else %}
                    <p>Your account has been created successfully. Start exploring amazing wedding vendors and plan your dream wedding!</p>
                    {% endif %}
                    <a href="{{ frontend_url }}" class="button">Visit PakWedding Portal</a>
                    <p>If you have any questions, feel free to contact our support team.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 PakWedding Portal. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

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
