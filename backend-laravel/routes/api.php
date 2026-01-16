<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toDateTimeString()
    ]);
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public package routes
Route::prefix('packages')->group(function () {
    Route::get('/', [PackageController::class, 'index']);
    Route::get('/featured', [PackageController::class, 'featured']);
    Route::get('/{id}', [PackageController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Require Authentication)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
    });

    // User routes
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::post('/avatar', [UserController::class, 'uploadAvatar']);
    });

    // Package routes (authenticated)
    Route::prefix('packages')->group(function () {
        Route::post('/', [PackageController::class, 'store']);
        Route::put('/{id}', [PackageController::class, 'update']);
        Route::delete('/{id}', [PackageController::class, 'destroy']);
    });

    // Booking routes
    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('/statistics', [BookingController::class, 'statistics']);
        Route::get('/{id}', [BookingController::class, 'show']);
        Route::patch('/{id}/status', [BookingController::class, 'updateStatus']);
        Route::post('/{id}/cancel', [BookingController::class, 'cancel']);
    });

    // Review routes
    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
    });

    // Payment routes
    Route::prefix('payments')->group(function () {
        Route::post('/create', [PaymentController::class, 'create']);
        Route::post('/verify', [PaymentController::class, 'verify']);
        Route::get('/history', [PaymentController::class, 'history']);
    });

    /*
    |--------------------------------------------------------------------------
    | Vendor Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:vendor')->prefix('vendor')->group(function () {
        Route::get('/dashboard', [VendorController::class, 'dashboard']);
        Route::get('/packages', [PackageController::class, 'vendorPackages']);
        Route::get('/bookings', [VendorController::class, 'bookings']);
        Route::get('/statistics', [VendorController::class, 'statistics']);
        Route::get('/profile', [VendorController::class, 'profile']);
        Route::put('/profile', [VendorController::class, 'updateProfile']);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/statistics', [AdminController::class, 'statistics']);

        // User management
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{id}', [AdminController::class, 'showUser']);
        Route::patch('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

        // Package management
        Route::get('/packages', [AdminController::class, 'packages']);
        Route::patch('/packages/{id}/approve', [AdminController::class, 'approvePackage']);
        Route::patch('/packages/{id}/reject', [AdminController::class, 'rejectPackage']);
        Route::patch('/packages/{id}/feature', [AdminController::class, 'toggleFeatured']);

        // Booking management
        Route::get('/bookings', [AdminController::class, 'bookings']);
        Route::get('/bookings/{id}', [AdminController::class, 'showBooking']);

        // Payment management
        Route::get('/payments', [AdminController::class, 'payments']);

        // Settings
        Route::get('/settings', [AdminController::class, 'settings']);
        Route::put('/settings', [AdminController::class, 'updateSettings']);
    });
});

/*
|--------------------------------------------------------------------------
| Webhook Routes (No Authentication)
|--------------------------------------------------------------------------
*/

Route::prefix('webhooks')->group(function () {
    Route::post('/razorpay', [PaymentController::class, 'razorpayWebhook']);
    Route::post('/stripe', [PaymentController::class, 'stripeWebhook']);
    Route::post('/paypal', [PaymentController::class, 'paypalWebhook']);
});
