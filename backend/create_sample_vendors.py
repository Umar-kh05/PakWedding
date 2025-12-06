"""
Script to create sample vendors in the database
Run this script to populate the database with sample vendors from vendorImages config
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.core.security import hash_password
from datetime import datetime
from app.repositories.user_repository import UserRepository
from app.repositories.vendor_repository import VendorRepository

# Sample vendor data from frontend config
PAKISTANI_VENDOR_IMAGES = [
    # Photography Vendors (6 images)
    {
        'id': 'pakistani-photography-1',
        'name': 'Elite Photography Studio Lahore',
        'category': 'Photography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764964999/vendors/pakistani-vendor-photography-1.jpg',
        'description': 'Professional wedding photography in Lahore'
    },
    {
        'id': 'pakistani-photography-2',
        'name': 'Royal Moments Photography Karachi',
        'category': 'Photography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965001/vendors/pakistani-vendor-photography-2.jpg',
        'description': 'Capturing your special moments in Karachi'
    },
    {
        'id': 'pakistani-photography-3',
        'name': 'Dream Wedding Photography Islamabad',
        'category': 'Photography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965003/vendors/pakistani-vendor-photography-3.jpg',
        'description': 'Premium wedding photography services'
    },
    {
        'id': 'pakistani-photography-4',
        'name': 'Shadi Studio Rawalpindi',
        'category': 'Photography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965006/vendors/pakistani-vendor-photography-4.jpg',
        'description': 'Traditional and modern wedding photography'
    },
    {
        'id': 'pakistani-photography-5',
        'name': 'Golden Lens Photography Faisalabad',
        'category': 'Photography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965009/vendors/pakistani-vendor-photography-5.jpg',
        'description': 'Creative wedding photography solutions'
    },
    {
        'id': 'pakistani-photography-6',
        'name': 'Memories Captured Multan',
        'category': 'Photography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965020/vendors/pakistani-vendor-photography-6.jpg',
        'description': 'Preserving your wedding memories forever'
    },
    # Catering Vendors (6 images)
    {
        'id': 'pakistani-catering-1',
        'name': 'Royal Caterers Lahore',
        'category': 'Caterer',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965067/vendors/pakistani-vendor-catering-1.jpg',
        'description': 'Authentic Pakistani cuisine for your wedding'
    },
    {
        'id': 'pakistani-catering-2',
        'name': 'Mughal Dastarkhwan Karachi',
        'category': 'Caterer',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965074/vendors/pakistani-vendor-catering-2.jpg',
        'description': 'Traditional Mughlai and Pakistani dishes'
    },
    {
        'id': 'pakistani-catering-3',
        'name': 'Desi Khana Caterers Islamabad',
        'category': 'Caterer',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965080/vendors/pakistani-vendor-catering-3.jpg',
        'description': 'Home-style Pakistani wedding catering'
    },
    {
        'id': 'pakistani-catering-4',
        'name': 'Zaiqa Catering Services',
        'category': 'Caterer',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965086/vendors/pakistani-vendor-catering-4.jpg',
        'description': 'Premium wedding catering services'
    },
    {
        'id': 'pakistani-catering-5',
        'name': 'Spice Route Caterers Lahore',
        'category': 'Caterer',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965101/vendors/pakistani-vendor-catering-5.jpg',
        'description': 'Exotic flavors for your special day'
    },
    {
        'id': 'pakistani-catering-6',
        'name': 'Feast Masters Karachi',
        'category': 'Caterer',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965103/vendors/pakistani-vendor-catering-6.jpg',
        'description': 'Grand feasts for grand celebrations'
    },
    # Decoration Vendors (5 images)
    {
        'id': 'pakistani-decoration-1',
        'name': 'Shadi Decor Lahore',
        'category': 'Decorator',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965106/vendors/pakistani-vendor-decoration-1.jpg',
        'description': 'Beautiful wedding decorations and setups'
    },
    {
        'id': 'pakistani-decoration-2',
        'name': 'Royal Wedding Decor Karachi',
        'category': 'Decorator',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965110/vendors/pakistani-vendor-decoration-2.jpg',
        'description': 'Elegant wedding decoration services'
    },
    {
        'id': 'pakistani-decoration-3',
        'name': 'Dream Decorators Islamabad',
        'category': 'Decorator',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965115/vendors/pakistani-vendor-decoration-3.jpg',
        'description': 'Modern and traditional wedding decorations'
    },
    {
        'id': 'pakistani-decoration-4',
        'name': 'Elegant Events Decor Faisalabad',
        'category': 'Decorator',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965118/vendors/pakistani-vendor-decoration-4.jpg',
        'description': 'Transforming spaces into dream venues'
    },
    {
        'id': 'pakistani-decoration-5',
        'name': 'Wedding Wonders Multan',
        'category': 'Decorator',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965122/vendors/pakistani-vendor-decoration-5.jpg',
        'description': 'Magical decorations for magical moments'
    },
    # Venue Vendors (5 images)
    {
        'id': 'pakistani-venue-1',
        'name': 'Pearl Marquee Lahore',
        'category': 'Venue',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965126/vendors/pakistani-vendor-venue-1.jpg',
        'description': 'Luxurious wedding venue in Lahore'
    },
    {
        'id': 'pakistani-venue-2',
        'name': 'Grand Ballroom Karachi',
        'category': 'Venue',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965130/vendors/pakistani-vendor-venue-2.jpg',
        'description': 'Elegant wedding hall in Karachi'
    },
    {
        'id': 'pakistani-venue-3',
        'name': 'Royal Gardens Islamabad',
        'category': 'Venue',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965134/vendors/pakistani-vendor-venue-3.jpg',
        'description': 'Beautiful outdoor wedding venue'
    },
    {
        'id': 'pakistani-venue-4',
        'name': 'Crystal Palace Faisalabad',
        'category': 'Venue',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965138/vendors/pakistani-vendor-venue-4.jpg',
        'description': 'Stunning indoor wedding venue'
    },
    {
        'id': 'pakistani-venue-5',
        'name': 'Gardenia Events Multan',
        'category': 'Venue',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965143/vendors/pakistani-vendor-venue-5.jpg',
        'description': 'Scenic outdoor wedding location'
    },
    # Makeup & Beauty (3 images)
    {
        'id': 'pakistani-makeup-1',
        'name': 'Bridal Beauty Studio Lahore',
        'category': 'Makeup Artist',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965146/vendors/pakistani-vendor-makeup-1.jpg',
        'description': 'Professional bridal makeup and beauty services'
    },
    {
        'id': 'pakistani-makeup-2',
        'name': 'Glamour Makeup Artists Karachi',
        'category': 'Makeup Artist',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965149/vendors/pakistani-vendor-makeup-2.jpg',
        'description': 'Expert bridal makeup and hairstyling'
    },
    {
        'id': 'pakistani-makeup-3',
        'name': 'Bridal Glow Islamabad',
        'category': 'Makeup Artist',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965157/vendors/pakistani-vendor-makeup-3.jpg',
        'description': 'Making you shine on your special day'
    },
    # DJ & Entertainment (3 images)
    {
        'id': 'pakistani-dj-1',
        'name': 'DJ Sound System Lahore',
        'category': 'DJ',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965160/vendors/pakistani-vendor-dj-1.jpg',
        'description': 'Professional DJ and sound system services'
    },
    {
        'id': 'pakistani-dj-2',
        'name': 'Wedding Entertainment Karachi',
        'category': 'DJ',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965165/vendors/pakistani-vendor-dj-2.jpg',
        'description': 'Music and entertainment for your wedding'
    },
    {
        'id': 'pakistani-dj-3',
        'name': 'Beat Masters Islamabad',
        'category': 'DJ',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965168/vendors/pakistani-vendor-dj-3.jpg',
        'description': 'Keeping the party alive all night'
    },
    # Florist (2 images)
    {
        'id': 'pakistani-florist-1',
        'name': 'Bloom Flowers Lahore',
        'category': 'Florist',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965172/vendors/pakistani-vendor-florist-1.jpg',
        'description': 'Beautiful wedding flower arrangements'
    },
    {
        'id': 'pakistani-florist-2',
        'name': 'Rose Garden Florists Karachi',
        'category': 'Florist',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965176/vendors/pakistani-vendor-florist-2.jpg',
        'description': 'Elegant floral designs for weddings'
    },
    # Mehndi Artist (2 images)
    {
        'id': 'pakistani-mehndi-1',
        'name': 'Henna Art Studio Karachi',
        'category': 'Mehndi',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965181/vendors/pakistani-vendor-mehndi-1.jpg',
        'description': 'Traditional and modern mehndi designs'
    },
    {
        'id': 'pakistani-mehndi-2',
        'name': 'Bridal Henna Artists Lahore',
        'category': 'Mehndi',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965185/vendors/pakistani-vendor-mehndi-2.jpg',
        'description': 'Intricate henna designs for brides'
    },
    # Videography (2 images)
    {
        'id': 'pakistani-videography-1',
        'name': 'Cinematic Wedding Films Lahore',
        'category': 'Videography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965190/vendors/pakistani-vendor-videography-1.jpg',
        'description': 'Professional wedding videography services'
    },
    {
        'id': 'pakistani-videography-2',
        'name': 'Memory Makers Karachi',
        'category': 'Videography',
        'url': 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965195/vendors/pakistani-vendor-videography-2.jpg',
        'description': 'Creating cinematic wedding memories'
    }
]

CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Gujranwala', 'Sialkot']
DEFAULT_PASSWORD = 'vendor123'  # Default password for all sample vendors


async def create_sample_vendors():
    """Create sample vendors in the database"""
    print("Creating sample vendors...")
    
    # Connect to database
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    db = client[settings.DATABASE_NAME]
    
    user_repo = UserRepository(db)
    vendor_repo = VendorRepository(db)
    
    created_count = 0
    skipped_count = 0
    error_count = 0
    
    for index, vendor_data in enumerate(PAKISTANI_VENDOR_IMAGES):
        try:
            # Extract city from name or use default
            city = None
            for c in CITIES:
                if c in vendor_data['name']:
                    city = c
                    break
            if not city:
                city = CITIES[index % len(CITIES)]
            
            # Generate email from business name
            email_base = vendor_data['name'].lower().replace(' ', '').replace("'", '').replace('-', '')
            email = f"{email_base}@pakwedding.com"
            
            # Check if vendor already exists
            existing_vendor = await vendor_repo.find_one({"email": email})
            if existing_vendor:
                print(f"[SKIP] Skipping {vendor_data['name']} (already exists)")
                skipped_count += 1
                continue
            
            # Check if user with this email exists
            existing_user = await user_repo.get_by_email(email)
            if existing_user:
                print(f"[SKIP] Skipping {vendor_data['name']} (user with email already exists)")
                skipped_count += 1
                continue
            
            # Generate phone number
            phone_number = f"+92 300 {1000000 + index * 123456}"
            
            # Calculate rating and bookings (similar to frontend logic)
            rating = 4.0 + (index % 10) * 0.1
            total_bookings = 20 + (index % 50) * 5
            
            # Create user account
            user_dict = {
                "email": email,
                "full_name": "Manager",  # Default contact person
                "phone_number": phone_number,
                "role": "vendor",
                "hashed_password": hash_password(DEFAULT_PASSWORD),
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            user = await user_repo.create(user_dict)
            
            # Create vendor profile
            vendor_dict = {
                "business_name": vendor_data['name'],
                "contact_person": "Manager",
                "email": email,
                "phone_number": phone_number,
                "business_address": f"{city}, Pakistan",
                "service_category": vendor_data['category'],
                "description": vendor_data['description'],
                "image_url": vendor_data['url'],
                "rating": round(rating, 1),
                "total_bookings": total_bookings,
                "gallery_images": [],
                "user_id": user["_id"],
                "is_approved": True,  # Auto-approved
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            vendor = await vendor_repo.create(vendor_dict)
            print(f"[OK] Created: {vendor_data['name']} ({vendor_data['category']})")
            created_count += 1
            
        except Exception as e:
            print(f"[ERROR] Error creating {vendor_data['name']}: {e}")
            error_count += 1
    
    print(f"\n[SUMMARY]")
    print(f"   Created: {created_count} vendors")
    print(f"   Skipped: {skipped_count} vendors")
    print(f"   Errors: {error_count} vendors")
    print(f"\n[INFO] Default password for all vendors: {DEFAULT_PASSWORD}")
    print(f"   (Vendors can change this after logging in)")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(create_sample_vendors())

