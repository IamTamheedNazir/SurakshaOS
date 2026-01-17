<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@umrahconnect.in',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
            'email_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Sample Vendor
        User::create([
            'first_name' => 'Demo',
            'last_name' => 'Vendor',
            'email' => 'vendor@umrahconnect.in',
            'password' => Hash::make('vendor123'),
            'role' => 'vendor',
            'status' => 'active',
            'email_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Sample Customer
        User::create([
            'first_name' => 'Demo',
            'last_name' => 'Customer',
            'email' => 'customer@umrahconnect.in',
            'password' => Hash::make('customer123'),
            'role' => 'customer',
            'status' => 'active',
            'email_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Default Settings
        $settings = [
            // General Settings
            ['setting_key' => 'site_name', 'setting_value' => 'UmrahConnect', 'setting_type' => 'string', 'setting_group' => 'general'],
            ['setting_key' => 'site_description', 'setting_value' => 'Your trusted Umrah booking platform', 'setting_type' => 'string', 'setting_group' => 'general'],
            ['setting_key' => 'site_email', 'setting_value' => 'info@umrahconnect.in', 'setting_type' => 'string', 'setting_group' => 'general'],
            ['setting_key' => 'site_phone', 'setting_value' => '+91 1234567890', 'setting_type' => 'string', 'setting_group' => 'general'],
            
            // Currency Settings
            ['setting_key' => 'default_currency', 'setting_value' => 'INR', 'setting_type' => 'string', 'setting_group' => 'currency'],
            ['setting_key' => 'currency_symbol', 'setting_value' => '₹', 'setting_type' => 'string', 'setting_group' => 'currency'],
            
            // Commission Settings
            ['setting_key' => 'commission_rate', 'setting_value' => '10', 'setting_type' => 'float', 'setting_group' => 'commission'],
            ['setting_key' => 'commission_type', 'setting_value' => 'percentage', 'setting_type' => 'string', 'setting_group' => 'commission'],
            
            // Booking Settings
            ['setting_key' => 'booking_prefix', 'setting_value' => 'UC', 'setting_type' => 'string', 'setting_group' => 'booking'],
            ['setting_key' => 'auto_confirm_bookings', 'setting_value' => '0', 'setting_type' => 'boolean', 'setting_group' => 'booking'],
            ['setting_key' => 'cancellation_allowed', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'booking'],
            ['setting_key' => 'cancellation_hours', 'setting_value' => '24', 'setting_type' => 'integer', 'setting_group' => 'booking'],
            
            // Payment Settings
            ['setting_key' => 'razorpay_enabled', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'payment'],
            ['setting_key' => 'stripe_enabled', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'payment'],
            ['setting_key' => 'paypal_enabled', 'setting_value' => '0', 'setting_type' => 'boolean', 'setting_group' => 'payment'],
            
            // Email Settings
            ['setting_key' => 'email_notifications', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'email'],
            ['setting_key' => 'booking_confirmation_email', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'email'],
            ['setting_key' => 'payment_confirmation_email', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'email'],
            
            // Review Settings
            ['setting_key' => 'reviews_enabled', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'review'],
            ['setting_key' => 'review_moderation', 'setting_value' => '1', 'setting_type' => 'boolean', 'setting_group' => 'review'],
            ['setting_key' => 'verified_purchase_only', 'setting_value' => '0', 'setting_type' => 'boolean', 'setting_group' => 'review'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        // Run CMS Seeder
        $this->call(CMSSeeder::class);

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin: admin@umrahconnect.in / admin123');
        $this->command->info('Vendor: vendor@umrahconnect.in / vendor123');
        $this->command->info('Customer: customer@umrahconnect.in / customer123');
        $this->command->info('CMS data (banners, testimonials, themes, settings) seeded!');
    }
}
