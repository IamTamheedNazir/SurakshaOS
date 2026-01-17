<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Banner;
use App\Models\Testimonial;
use App\Models\Theme;
use App\Models\Setting;

class CMSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Banners
        $this->seedBanners();

        // Seed Testimonials
        $this->seedTestimonials();

        // Seed Themes
        $this->seedThemes();

        // Seed Settings
        $this->seedSettings();
    }

    private function seedBanners()
    {
        $banners = [
            [
                'title' => 'Welcome to UmrahConnect',
                'description' => 'Your trusted partner for Umrah packages',
                'image' => '/images/banners/hero-1.jpg',
                'link' => '/packages',
                'button_text' => 'Explore Packages',
                'order' => 1,
                'is_active' => true,
                'type' => 'hero',
            ],
            [
                'title' => 'Special Ramadan Packages',
                'description' => 'Book now and get exclusive discounts',
                'image' => '/images/banners/hero-2.jpg',
                'link' => '/packages?category=ramadan',
                'button_text' => 'View Offers',
                'order' => 2,
                'is_active' => true,
                'type' => 'hero',
            ],
            [
                'title' => 'Trusted by Thousands',
                'description' => 'Join our community of satisfied pilgrims',
                'image' => '/images/banners/hero-3.jpg',
                'link' => '/about',
                'button_text' => 'Learn More',
                'order' => 3,
                'is_active' => true,
                'type' => 'hero',
            ],
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }
    }

    private function seedTestimonials()
    {
        $testimonials = [
            [
                'name' => 'Ahmed Khan',
                'email' => 'ahmed@example.com',
                'image' => '/images/testimonials/user-1.jpg',
                'designation' => 'Business Owner',
                'company' => 'Khan Enterprises',
                'content' => 'Excellent service! The entire Umrah journey was smooth and well-organized. Highly recommended for anyone planning their pilgrimage.',
                'rating' => 5,
                'is_active' => true,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name' => 'Fatima Ali',
                'email' => 'fatima@example.com',
                'image' => '/images/testimonials/user-2.jpg',
                'designation' => 'Teacher',
                'company' => 'Al-Noor School',
                'content' => 'UmrahConnect made my dream come true. The package was affordable and the service was exceptional. May Allah bless this team!',
                'rating' => 5,
                'is_active' => true,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name' => 'Mohammed Hassan',
                'email' => 'mohammed@example.com',
                'image' => '/images/testimonials/user-3.jpg',
                'designation' => 'Engineer',
                'company' => 'Tech Solutions',
                'content' => 'Professional and caring staff. They took care of every detail from visa to accommodation. Best Umrah experience ever!',
                'rating' => 5,
                'is_active' => true,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'name' => 'Aisha Rahman',
                'email' => 'aisha@example.com',
                'image' => '/images/testimonials/user-4.jpg',
                'designation' => 'Doctor',
                'company' => 'City Hospital',
                'content' => 'Alhamdulillah! Everything was perfect. The hotels were close to Haram and the group was very supportive. Thank you UmrahConnect!',
                'rating' => 5,
                'is_active' => true,
                'is_featured' => false,
                'order' => 4,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }

    private function seedThemes()
    {
        $themes = [
            [
                'name' => 'Default Theme',
                'slug' => 'default',
                'description' => 'Clean and modern default theme',
                'colors' => [
                    'primary' => '#2563eb',
                    'secondary' => '#10b981',
                    'accent' => '#f59e0b',
                    'background' => '#ffffff',
                    'text' => '#1f2937',
                ],
                'fonts' => [
                    'heading' => 'Inter',
                    'body' => 'Inter',
                ],
                'settings' => [
                    'border_radius' => '8px',
                    'shadow' => 'medium',
                ],
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'name' => 'Islamic Green',
                'slug' => 'islamic-green',
                'description' => 'Traditional Islamic green theme',
                'colors' => [
                    'primary' => '#059669',
                    'secondary' => '#0d9488',
                    'accent' => '#eab308',
                    'background' => '#f0fdf4',
                    'text' => '#064e3b',
                ],
                'fonts' => [
                    'heading' => 'Poppins',
                    'body' => 'Roboto',
                ],
                'settings' => [
                    'border_radius' => '12px',
                    'shadow' => 'large',
                ],
                'is_active' => false,
                'is_default' => false,
            ],
        ];

        foreach ($themes as $theme) {
            Theme::create($theme);
        }
    }

    private function seedSettings()
    {
        $settings = [
            // General Settings
            ['key' => 'site_name', 'value' => 'UmrahConnect', 'type' => 'public'],
            ['key' => 'site_tagline', 'value' => 'Your Trusted Umrah Partner', 'type' => 'public'],
            ['key' => 'site_description', 'value' => 'Book affordable and reliable Umrah packages with UmrahConnect', 'type' => 'public'],
            ['key' => 'site_logo', 'value' => '/images/logo.png', 'type' => 'public'],
            ['key' => 'site_favicon', 'value' => '/images/favicon.ico', 'type' => 'public'],
            
            // Contact Information
            ['key' => 'contact_email', 'value' => 'info@umrahconnect.in', 'type' => 'public'],
            ['key' => 'contact_phone', 'value' => '+91 1234567890', 'type' => 'public'],
            ['key' => 'contact_address', 'value' => 'Mumbai, Maharashtra, India', 'type' => 'public'],
            ['key' => 'contact_whatsapp', 'value' => '+91 1234567890', 'type' => 'public'],
            
            // Social Media
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/umrahconnect', 'type' => 'public'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/umrahconnect', 'type' => 'public'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/umrahconnect', 'type' => 'public'],
            ['key' => 'social_youtube', 'value' => 'https://youtube.com/umrahconnect', 'type' => 'public'],
            
            // Business Settings
            ['key' => 'currency', 'value' => 'INR', 'type' => 'public'],
            ['key' => 'currency_symbol', 'value' => '₹', 'type' => 'public'],
            ['key' => 'timezone', 'value' => 'Asia/Kolkata', 'type' => 'general'],
            ['key' => 'date_format', 'value' => 'd/m/Y', 'type' => 'general'],
            
            // Features
            ['key' => 'enable_bookings', 'value' => 'true', 'type' => 'general'],
            ['key' => 'enable_reviews', 'value' => 'true', 'type' => 'general'],
            ['key' => 'enable_vendor_registration', 'value' => 'true', 'type' => 'general'],
            ['key' => 'require_email_verification', 'value' => 'false', 'type' => 'general'],
            
            // Payment Settings (Private)
            ['key' => 'razorpay_key', 'value' => '', 'type' => 'private'],
            ['key' => 'razorpay_secret', 'value' => '', 'type' => 'private'],
            ['key' => 'stripe_key', 'value' => '', 'type' => 'private'],
            ['key' => 'stripe_secret', 'value' => '', 'type' => 'private'],
            
            // Email Settings (Private)
            ['key' => 'smtp_host', 'value' => 'smtp.gmail.com', 'type' => 'private'],
            ['key' => 'smtp_port', 'value' => '587', 'type' => 'private'],
            ['key' => 'smtp_username', 'value' => '', 'type' => 'private'],
            ['key' => 'smtp_password', 'value' => '', 'type' => 'private'],
            
            // SEO Settings
            ['key' => 'meta_keywords', 'value' => 'umrah, hajj, packages, saudi arabia, mecca, medina', 'type' => 'public'],
            ['key' => 'google_analytics_id', 'value' => '', 'type' => 'public'],
            ['key' => 'facebook_pixel_id', 'value' => '', 'type' => 'public'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
