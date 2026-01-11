const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Models
const User = require('../models/User');
const Package = require('../models/Package');
const Banner = require('../models/Banner');
const Theme = require('../models/Theme');
const SiteSettings = require('../models/SiteSettings');
const Testimonial = require('../models/Testimonial');

// Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Seed Data
const seedData = async () => {
  try {
    console.log('🌱 Starting Database Seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Package.deleteMany({});
    await Banner.deleteMany({});
    await Theme.deleteMany({});
    await SiteSettings.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // ========================================
    // CREATE USERS
    // ========================================
    console.log('👥 Creating users...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@umrahconnect.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: 'admin',
      isActive: true,
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true
    });

    // Vendor Users
    const vendor1 = await User.create({
      name: 'Al-Haramain Tours',
      email: 'vendor1@umrahconnect.com',
      password: hashedPassword,
      phone: '+919876543211',
      role: 'vendor',
      isActive: true,
      isVerified: true,
      isEmailVerified: true,
      vendorInfo: {
        companyName: 'Al-Haramain Tours & Travels',
        companyRegistration: 'REG123456',
        gstNumber: 'GST123456789',
        approvalStatus: 'approved',
        approvedAt: new Date(),
        rating: { average: 4.5, count: 120 },
        totalPackages: 0,
        totalBookings: 0
      }
    });

    const vendor2 = await User.create({
      name: 'Makkah Express',
      email: 'vendor2@umrahconnect.com',
      password: hashedPassword,
      phone: '+919876543212',
      role: 'vendor',
      isActive: true,
      isVerified: true,
      isEmailVerified: true,
      vendorInfo: {
        companyName: 'Makkah Express Travel Services',
        companyRegistration: 'REG789012',
        gstNumber: 'GST987654321',
        approvalStatus: 'approved',
        approvedAt: new Date(),
        rating: { average: 4.7, count: 95 },
        totalPackages: 0,
        totalBookings: 0
      }
    });

    // Customer Users
    const customer1 = await User.create({
      name: 'Ahmed Khan',
      email: 'customer1@example.com',
      password: hashedPassword,
      phone: '+919876543213',
      role: 'customer',
      isActive: true,
      isVerified: true
    });

    const customer2 = await User.create({
      name: 'Fatima Ali',
      email: 'customer2@example.com',
      password: hashedPassword,
      phone: '+919876543214',
      role: 'customer',
      isActive: true,
      isVerified: true
    });

    console.log('✅ Users created:', {
      admin: admin.email,
      vendors: [vendor1.email, vendor2.email],
      customers: [customer1.email, customer2.email]
    });
    console.log('');

    // ========================================
    // CREATE THEMES
    // ========================================
    console.log('🎨 Creating themes...');

    const theme1 = await Theme.create({
      name: 'islamic-green',
      displayName: 'Islamic Green',
      description: 'Traditional Islamic theme with green and gold colors',
      colors: {
        primary: '#10b981',
        primaryDark: '#059669',
        secondary: '#d4af37',
        accent: '#fef3c7',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280'
      },
      isActive: true,
      isDefault: true
    });

    const theme2 = await Theme.create({
      name: 'royal-blue',
      displayName: 'Royal Blue',
      description: 'Elegant theme with blue and gold colors',
      colors: {
        primary: '#1e40af',
        primaryDark: '#1e3a8a',
        secondary: '#d4af37',
        accent: '#dbeafe',
        background: '#ffffff',
        text: '#1f2937',
        textLight: '#6b7280'
      },
      isActive: false,
      isDefault: false
    });

    console.log('✅ Themes created:', [theme1.name, theme2.name]);
    console.log('');

    // ========================================
    // CREATE BANNERS
    // ========================================
    console.log('🖼️  Creating banners...');

    await Banner.create([
      {
        title: 'Special Ramadan Umrah Packages',
        subtitle: 'Book Now and Save Up to 30%',
        description: 'Experience the blessed month of Ramadan in the holy cities',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200',
        buttonText: 'Explore Packages',
        buttonLink: '/packages?type=umrah',
        order: 1,
        isActive: true,
        backgroundColor: '#10b981',
        textColor: '#ffffff'
      },
      {
        title: 'Hajj 2024 Packages Available',
        subtitle: 'Limited Seats - Book Your Journey',
        description: 'Fulfill your religious obligation with our comprehensive Hajj packages',
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200',
        buttonText: 'View Hajj Packages',
        buttonLink: '/packages?type=hajj',
        order: 2,
        isActive: true,
        backgroundColor: '#1e40af',
        textColor: '#ffffff'
      },
      {
        title: 'Luxury Umrah Experience',
        subtitle: '5-Star Hotels Near Haram',
        description: 'Premium packages with world-class accommodation and services',
        image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200',
        buttonText: 'Discover Luxury',
        buttonLink: '/packages?category=luxury',
        order: 3,
        isActive: true,
        backgroundColor: '#d4af37',
        textColor: '#1f2937'
      }
    ]);

    console.log('✅ Banners created: 3');
    console.log('');

    // ========================================
    // CREATE PACKAGES
    // ========================================
    console.log('📦 Creating packages...');

    const packages = await Package.create([
      {
        title: '10 Days Economy Umrah Package',
        description: 'Affordable Umrah package with comfortable accommodation and all essential services included.',
        shortDescription: 'Budget-friendly Umrah package with 3-star hotels',
        type: 'umrah',
        category: 'economy',
        price: 45000,
        originalPrice: 55000,
        duration: { days: 10, nights: 9 },
        images: [
          { url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800', isPrimary: false }
        ],
        inclusions: [
          'Return Economy Flight Tickets',
          '3-Star Hotel in Makkah (5 nights)',
          '3-Star Hotel in Madinah (4 nights)',
          'Visa Processing',
          'Ground Transportation',
          'Ziyarat Tours',
          'Experienced Guide'
        ],
        exclusions: [
          'Travel Insurance',
          'Personal Expenses',
          'Laundry Services',
          'Room Service'
        ],
        accommodation: {
          makkah: {
            hotelName: 'Al Safwah Hotel',
            hotelRating: 3,
            distanceFromHaram: '800m',
            roomType: 'Double/Triple Sharing',
            nights: 5
          },
          madinah: {
            hotelName: 'Madinah Palace',
            hotelRating: 3,
            distanceFromMasjid: '600m',
            roomType: 'Double/Triple Sharing',
            nights: 4
          }
        },
        transportation: {
          flight: {
            included: true,
            airline: 'Air India',
            class: 'economy',
            departure: 'Delhi',
            return: 'Delhi'
          },
          groundTransport: 'bus'
        },
        visa: {
          included: true,
          type: 'Umrah Visa',
          processingTime: '7-10 days'
        },
        availability: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-12-31'),
          totalSeats: 50,
          availableSeats: 50
        },
        vendor: vendor1._id,
        vendorName: vendor1.name,
        features: [
          'Experienced Multilingual Guide',
          'Comfortable AC Transportation',
          'Group Ziyarat Tours',
          '24/7 Support'
        ],
        status: 'approved',
        isActive: true,
        isFeatured: true,
        isPopular: true,
        featuredOrder: 1
      },
      {
        title: '14 Days Premium Umrah Package',
        description: 'Premium Umrah experience with 4-star hotels near Haram and personalized services.',
        shortDescription: 'Premium package with 4-star hotels close to Haram',
        type: 'umrah',
        category: 'premium',
        price: 85000,
        originalPrice: 95000,
        duration: { days: 14, nights: 13 },
        images: [
          { url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800', isPrimary: false }
        ],
        inclusions: [
          'Return Economy Flight Tickets',
          '4-Star Hotel in Makkah (8 nights)',
          '4-Star Hotel in Madinah (5 nights)',
          'Visa Processing',
          'Private Transportation',
          'Comprehensive Ziyarat Tours',
          'Experienced Guide',
          'Breakfast & Dinner'
        ],
        exclusions: [
          'Travel Insurance',
          'Lunch',
          'Personal Expenses'
        ],
        accommodation: {
          makkah: {
            hotelName: 'Makkah Towers',
            hotelRating: 4,
            distanceFromHaram: '300m',
            roomType: 'Double Sharing',
            nights: 8
          },
          madinah: {
            hotelName: 'Madinah Hilton',
            hotelRating: 4,
            distanceFromMasjid: '200m',
            roomType: 'Double Sharing',
            nights: 5
          }
        },
        transportation: {
          flight: {
            included: true,
            airline: 'Emirates',
            class: 'economy',
            departure: 'Mumbai',
            return: 'Mumbai'
          },
          groundTransport: 'private_car'
        },
        visa: {
          included: true,
          type: 'Umrah Visa',
          processingTime: '5-7 days'
        },
        availability: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-12-31'),
          totalSeats: 30,
          availableSeats: 30
        },
        vendor: vendor1._id,
        vendorName: vendor1.name,
        features: [
          'Hotels Near Haram',
          'Private AC Transportation',
          'Meals Included',
          'VIP Ziyarat Tours',
          'Priority Support'
        ],
        status: 'approved',
        isActive: true,
        isFeatured: true,
        isPopular: true,
        featuredOrder: 2
      },
      {
        title: '21 Days Luxury Umrah Package',
        description: 'Ultimate luxury Umrah experience with 5-star hotels, business class flights, and exclusive services.',
        shortDescription: 'Luxury package with 5-star hotels and business class',
        type: 'umrah',
        category: 'luxury',
        price: 185000,
        originalPrice: 210000,
        duration: { days: 21, nights: 20 },
        images: [
          { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800', isPrimary: false }
        ],
        inclusions: [
          'Return Business Class Flight Tickets',
          '5-Star Hotel in Makkah (12 nights)',
          '5-Star Hotel in Madinah (8 nights)',
          'Visa Processing',
          'Private Luxury Transportation',
          'All Meals Included',
          'Exclusive Ziyarat Tours',
          'Personal Guide',
          'Travel Insurance',
          'Laundry Services'
        ],
        exclusions: [
          'Shopping Expenses',
          'Additional Personal Services'
        ],
        accommodation: {
          makkah: {
            hotelName: 'Fairmont Makkah Clock Royal Tower',
            hotelRating: 5,
            distanceFromHaram: 'Connected to Haram',
            roomType: 'Deluxe Room',
            nights: 12
          },
          madinah: {
            hotelName: 'Oberoi Madinah',
            hotelRating: 5,
            distanceFromMasjid: '50m',
            roomType: 'Deluxe Room',
            nights: 8
          }
        },
        transportation: {
          flight: {
            included: true,
            airline: 'Emirates',
            class: 'business',
            departure: 'Delhi',
            return: 'Delhi'
          },
          groundTransport: 'private_car'
        },
        visa: {
          included: true,
          type: 'Umrah Visa',
          processingTime: '3-5 days'
        },
        availability: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-12-31'),
          totalSeats: 20,
          availableSeats: 20
        },
        vendor: vendor2._id,
        vendorName: vendor2.name,
        features: [
          'Business Class Flights',
          '5-Star Hotels Connected to Haram',
          'All Meals Included',
          'Private Luxury Transportation',
          'Personal Guide',
          'VIP Services',
          'Travel Insurance'
        ],
        status: 'approved',
        isActive: true,
        isFeatured: true,
        isPopular: false,
        featuredOrder: 3
      },
      {
        title: '40 Days Hajj Package 2024',
        description: 'Complete Hajj package with all rituals, comfortable accommodation, and experienced guides.',
        shortDescription: 'Comprehensive Hajj package with full support',
        type: 'hajj',
        category: 'standard',
        price: 350000,
        originalPrice: 380000,
        duration: { days: 40, nights: 39 },
        images: [
          { url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800', isPrimary: false }
        ],
        inclusions: [
          'Return Economy Flight Tickets',
          'Hotel in Makkah (25 nights)',
          'Hotel in Madinah (10 nights)',
          'Mina Tents (4 nights)',
          'Visa Processing',
          'Ground Transportation',
          'All Meals During Hajj',
          'Experienced Hajj Guide',
          'Hajj Training Sessions'
        ],
        exclusions: [
          'Travel Insurance',
          'Personal Expenses',
          'Qurbani (Sacrifice)'
        ],
        accommodation: {
          makkah: {
            hotelName: 'Al Kiswah Towers',
            hotelRating: 3,
            distanceFromHaram: '500m',
            roomType: 'Quad Sharing',
            nights: 25
          },
          madinah: {
            hotelName: 'Madinah Grand Hotel',
            hotelRating: 3,
            distanceFromMasjid: '400m',
            roomType: 'Quad Sharing',
            nights: 10
          }
        },
        transportation: {
          flight: {
            included: true,
            airline: 'Saudi Airlines',
            class: 'economy',
            departure: 'Jeddah',
            return: 'Jeddah'
          },
          groundTransport: 'bus'
        },
        visa: {
          included: true,
          type: 'Hajj Visa',
          processingTime: '15-20 days'
        },
        availability: {
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-15'),
          totalSeats: 100,
          availableSeats: 100
        },
        vendor: vendor2._id,
        vendorName: vendor2.name,
        features: [
          'Complete Hajj Guidance',
          'Pre-Hajj Training',
          'Experienced Mutawwif',
          'Mina Tents Included',
          'All Meals During Hajj',
          '24/7 Support'
        ],
        status: 'approved',
        isActive: true,
        isFeatured: true,
        isPopular: true,
        featuredOrder: 4
      }
    ]);

    console.log('✅ Packages created:', packages.length);
    console.log('');

    // ========================================
    // CREATE TESTIMONIALS
    // ========================================
    console.log('⭐ Creating testimonials...');

    await Testimonial.create([
      {
        name: 'Ahmed Khan',
        designation: 'Business Owner',
        location: 'Mumbai, India',
        rating: 5,
        testimonial: 'Alhamdulillah! The Umrah experience was absolutely wonderful. The hotels were close to Haram, and the entire journey was well-organized. Highly recommended!',
        packageId: packages[0]._id,
        packageName: packages[0].title,
        travelDate: new Date('2024-01-15'),
        isVerified: true,
        isFeatured: true,
        isActive: true,
        order: 1
      },
      {
        name: 'Fatima Ali',
        designation: 'Teacher',
        location: 'Delhi, India',
        rating: 5,
        testimonial: 'The premium package exceeded our expectations. The guide was knowledgeable, and the accommodation was excellent. May Allah reward the team!',
        packageId: packages[1]._id,
        packageName: packages[1].title,
        travelDate: new Date('2024-02-10'),
        isVerified: true,
        isFeatured: true,
        isActive: true,
        order: 2
      },
      {
        name: 'Mohammed Rashid',
        designation: 'Engineer',
        location: 'Bangalore, India',
        rating: 4,
        testimonial: 'Great service and support throughout the journey. The only suggestion would be to improve meal variety. Overall, a blessed experience!',
        packageId: packages[0]._id,
        packageName: packages[0].title,
        travelDate: new Date('2024-01-20'),
        isVerified: true,
        isFeatured: true,
        isActive: true,
        order: 3
      },
      {
        name: 'Ayesha Siddiqui',
        designation: 'Doctor',
        location: 'Hyderabad, India',
        rating: 5,
        testimonial: 'The luxury package was worth every penny. Business class flights, 5-star hotels, and personalized service made our Umrah truly special. JazakAllah Khair!',
        packageId: packages[2]._id,
        packageName: packages[2].title,
        travelDate: new Date('2024-02-25'),
        isVerified: true,
        isFeatured: true,
        isActive: true,
        order: 4
      },
      {
        name: 'Ibrahim Hassan',
        designation: 'Businessman',
        location: 'Chennai, India',
        rating: 5,
        testimonial: 'Performed Hajj with this group and it was a life-changing experience. The guides were experienced and helpful at every step. Highly recommended for Hajj!',
        packageId: packages[3]._id,
        packageName: packages[3].title,
        travelDate: new Date('2023-07-15'),
        isVerified: true,
        isFeatured: true,
        isActive: true,
        order: 5
      },
      {
        name: 'Zainab Malik',
        designation: 'Homemaker',
        location: 'Pune, India',
        rating: 4,
        testimonial: 'Excellent organization and support. The team was always available to help. The only improvement needed is in communication before departure.',
        packageId: packages[1]._id,
        packageName: packages[1].title,
        travelDate: new Date('2024-03-05'),
        isVerified: true,
        isFeatured: false,
        isActive: true,
        order: 6
      }
    ]);

    console.log('✅ Testimonials created: 6');
    console.log('');

    // ========================================
    // CREATE SITE SETTINGS
    // ========================================
    console.log('⚙️  Creating site settings...');

    await SiteSettings.create({
      siteName: 'UmrahConnect',
      siteTagline: 'Your Trusted Partner for Sacred Journeys',
      siteDescription: 'Book your Umrah and Hajj packages with ease. We offer the best packages from verified vendors.',
      contact: {
        email: 'info@umrahconnect.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        address: '123 Islamic Center, Jama Masjid Road',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110006'
      },
      socialMedia: {
        facebook: 'https://facebook.com/umrahconnect',
        twitter: 'https://twitter.com/umrahconnect',
        instagram: 'https://instagram.com/umrahconnect',
        youtube: 'https://youtube.com/umrahconnect',
        linkedin: 'https://linkedin.com/company/umrahconnect'
      },
      businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '14:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '18:00', closed: false },
        sunday: { open: '09:00', close: '14:00', closed: false }
      },
      payment: {
        currency: 'INR',
        currencySymbol: '₹',
        razorpayEnabled: false,
        stripeEnabled: false
      },
      features: {
        enableBooking: true,
        enableReviews: true,
        enableBlog: true,
        enableNewsletter: true,
        enableChat: false,
        maintenanceMode: false
      },
      homepage: {
        heroTitle: 'Begin Your Sacred Journey',
        heroSubtitle: 'Discover the perfect Umrah and Hajj packages tailored for your spiritual journey',
        showFeaturedPackages: true,
        featuredPackagesLimit: 6,
        showPopularPackages: true,
        popularPackagesLimit: 6,
        showTestimonials: true,
        testimonialsLimit: 6
      },
      statistics: {
        totalPilgrims: 10000,
        totalPackages: 500,
        totalVendors: 85,
        yearsOfExperience: 10
      }
    });

    console.log('✅ Site settings created');
    console.log('');

    console.log('='.repeat(50));
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`   Users: 5 (1 admin, 2 vendors, 2 customers)`);
    console.log(`   Packages: ${packages.length}`);
    console.log(`   Banners: 3`);
    console.log(`   Themes: 2`);
    console.log(`   Testimonials: 6`);
    console.log(`   Site Settings: 1`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@umrahconnect.com / password123');
    console.log('   Vendor 1: vendor1@umrahconnect.com / password123');
    console.log('   Vendor 2: vendor2@umrahconnect.com / password123');
    console.log('   Customer 1: customer1@example.com / password123');
    console.log('   Customer 2: customer2@example.com / password123');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Run Seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

runSeeder();
