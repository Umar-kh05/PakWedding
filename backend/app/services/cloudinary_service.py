import cloudinary
import cloudinary.uploader
from app.core.config import settings
from typing import Optional

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


class CloudinaryService:
    
    @staticmethod
    async def upload_image(
        file_content: bytes,
        folder: str = "vendors",
        public_id: Optional[str] = None,
        resource_type: str = "image"
    ) -> dict:
        if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY or not settings.CLOUDINARY_API_SECRET:
            raise Exception("Cloudinary credentials are not configured. Please check your .env file.")
        
        try:
            import asyncio
            loop = asyncio.get_event_loop()
            
            def _upload():
                return cloudinary.uploader.upload(
                    file_content,
                    folder=folder,
                    public_id=public_id,
                    resource_type=resource_type,
                    overwrite=True,
                    invalidate=True
                )
            
            upload_result = await loop.run_in_executor(None, _upload)
            
            secure_url = upload_result.get("secure_url")
            if not secure_url:
                raise Exception("Cloudinary upload succeeded but no secure_url returned")
            
            return {
                "url": secure_url,
                "public_id": upload_result.get("public_id"),
                "width": upload_result.get("width"),
                "height": upload_result.get("height"),
                "format": upload_result.get("format")
            }
        except Exception as e:
            error_msg = str(e)
            if "Invalid API Key" in error_msg or "authentication" in error_msg.lower():
                raise Exception(f"Cloudinary authentication failed. Please check your API credentials in .env file. Error: {error_msg}")
            raise Exception(f"Cloudinary upload failed: {error_msg}")
    
    @staticmethod
    async def delete_image(public_id: str) -> dict:
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result
        except Exception as e:
            raise Exception(f"Cloudinary deletion failed: {str(e)}")
    
    @staticmethod
    def get_image_url(public_id: str, transformation: Optional[dict] = None) -> str:
        if transformation:
            return cloudinary.CloudinaryImage(public_id).build_url(**transformation)
        return cloudinary.CloudinaryImage(public_id).build_url()

