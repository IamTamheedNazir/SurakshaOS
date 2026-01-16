# 🔄 Convert UmrahConnect 2.0 to Laravel + PHP

## 🎯 NEW REQUIREMENT

**Your Hosting Supports:**
- ✅ PHP 8.x
- ✅ MySQL 8.x
- ✅ Laravel Framework
- ✅ JavaScript/JSON/HTML/CSS
- ❌ Node.js backend

**Solution:** Convert Node.js backend to Laravel PHP

---

## 📊 CONVERSION PLAN

### **Current Stack:**
```
Frontend: React (JavaScript)
Backend: Node.js + Express
Database: MySQL
```

### **New Stack:**
```
Frontend: React (JavaScript) - Keep as is
Backend: Laravel 10 (PHP 8.x) - Convert from Node.js
Database: MySQL 8.x - Keep schema
```

---

## 🚀 IMPLEMENTATION PLAN

### **Phase 1: Laravel Backend Setup** (4-6 hours)
Convert all Node.js API endpoints to Laravel

### **Phase 2: Frontend Integration** (2 hours)
Update React to use Laravel API

### **Phase 3: Database Migration** (1 hour)
Convert schema to Laravel migrations

### **Phase 4: Authentication** (2 hours)
Implement JWT auth in Laravel

### **Phase 5: Testing & Deployment** (2 hours)
Test and deploy to umrahconnect.in

**Total Time:** 11-13 hours

---

## 📁 NEW PROJECT STRUCTURE

```
umrahconnect-laravel/
├── backend/                    ← Laravel 10 Application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── PackageController.php
│   │   │   │   ├── BookingController.php
│   │   │   │   ├── UserController.php
│   │   │   │   ├── VendorController.php
│   │   │   │   └── AdminController.php
│   │   │   ├── Middleware/
│   │   │   │   ├── JwtMiddleware.php
│   │   │   │   └── RoleMiddleware.php
│   │   │   └── Requests/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Package.php
│   │   │   ├── Booking.php
│   │   │   ├── Payment.php
│   │   │   └── Review.php
│   │   └── Services/
│   │       ├── AuthService.php
│   │       ├── EmailService.php
│   │       └── PaymentService.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   ├── config/
│   ├── public/
│   │   └── index.php
│   ├── .env
│   ├── composer.json
│   └── artisan
│
├── frontend/                   ← React Application (unchanged)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── install/                    ← Installation Wizard (PHP)
    ├── index.php
    ├── wizard.html
    └── install.php
```

---

## 🔧 LARAVEL BACKEND CONVERSION

### **1. Authentication System**

#### **Node.js (Current):**
```javascript
// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isValid = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user });
};
```

#### **Laravel (New):**
```php
// backend/app/Http/Controllers/AuthController.php
<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => auth()->user()
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'first_name' => 'required',
            'last_name' => 'required'
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name']
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user
        ], 201);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
```

### **2. Package Management**

#### **Laravel Controller:**
```php
// backend/app/Http/Controllers/PackageController.php
<?php
namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $query = Package::with(['vendor', 'reviews']);

        // Filters
        if ($request->has('destination')) {
            $query->where('destination', $request->destination);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Pagination
        $packages = $query->paginate($request->get('per_page', 15));

        return response()->json($packages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'destination' => 'required|string',
            'inclusions' => 'array',
            'exclusions' => 'array'
        ]);

        $package = Package::create([
            ...$validated,
            'vendor_id' => auth()->id(),
            'status' => 'pending'
        ]);

        return response()->json($package, 201);
    }

    public function show($id)
    {
        $package = Package::with(['vendor', 'reviews.user'])
            ->findOrFail($id);

        return response()->json($package);
    }

    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        // Authorization check
        if ($package->vendor_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'duration' => 'integer|min:1',
            'status' => 'in:active,inactive,pending'
        ]);

        $package->update($validated);

        return response()->json($package);
    }

    public function destroy($id)
    {
        $package = Package::findOrFail($id);

        if ($package->vendor_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $package->delete();

        return response()->json(['message' => 'Package deleted successfully']);
    }
}
```

### **3. Booking System**

#### **Laravel Controller:**
```php
// backend/app/Http/Controllers/BookingController.php
<?php
namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'travelers' => 'required|integer|min:1',
            'travel_date' => 'required|date|after:today',
            'special_requests' => 'nullable|string'
        ]);

        $package = Package::findOrFail($validated['package_id']);
        $totalAmount = $package->price * $validated['travelers'];

        $booking = Booking::create([
            'booking_number' => 'UC-' . strtoupper(Str::random(8)),
            'user_id' => auth()->id(),
            'package_id' => $validated['package_id'],
            'travelers' => $validated['travelers'],
            'travel_date' => $validated['travel_date'],
            'total_amount' => $totalAmount,
            'status' => 'pending',
            'special_requests' => $validated['special_requests'] ?? null
        ]);

        return response()->json($booking, 201);
    }

    public function index(Request $request)
    {
        $query = Booking::with(['package', 'user']);

        if (auth()->user()->role === 'customer') {
            $query->where('user_id', auth()->id());
        } elseif (auth()->user()->role === 'vendor') {
            $query->whereHas('package', function($q) {
                $q->where('vendor_id', auth()->id());
            });
        }

        $bookings = $query->latest()->paginate(15);

        return response()->json($bookings);
    }

    public function show($id)
    {
        $booking = Booking::with(['package', 'user', 'payment'])
            ->findOrFail($id);

        // Authorization
        if ($booking->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($booking);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed'
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $validated['status']]);

        return response()->json($booking);
    }
}
```

### **4. Models**

#### **User Model:**
```php
// backend/app/Models/User.php
<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'email', 'password', 'first_name', 'last_name',
        'phone', 'role', 'status', 'email_verified'
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'email_verified' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function packages()
    {
        return $this->hasMany(Package::class, 'vendor_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isVendor()
    {
        return $this->role === 'vendor';
    }
}
```

#### **Package Model:**
```php
// backend/app/Models/Package.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'vendor_id', 'title', 'description', 'price',
        'duration', 'destination', 'inclusions', 'exclusions',
        'status', 'featured', 'images'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
        'featured' => 'boolean',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'images' => 'array'
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }
}
```

### **5. Routes**

```php
// backend/routes/api.php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\AdminController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{id}', [PackageController::class, 'show']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Packages
    Route::post('/packages', [PackageController::class, 'store']);
    Route::put('/packages/{id}', [PackageController::class, 'update']);
    Route::delete('/packages/{id}', [PackageController::class, 'destroy']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']);

    // User
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);

    // Vendor routes
    Route::middleware('role:vendor')->group(function () {
        Route::get('/vendor/dashboard', [VendorController::class, 'dashboard']);
        Route::get('/vendor/bookings', [VendorController::class, 'bookings']);
    });

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::patch('/admin/users/{id}/status', [AdminController::class, 'updateUserStatus']);
    });
});
```

---

## 📦 COMPOSER DEPENDENCIES

```json
{
    "require": {
        "php": "^8.1",
        "laravel/framework": "^10.0",
        "tymon/jwt-auth": "^2.0",
        "intervention/image": "^2.7",
        "guzzlehttp/guzzle": "^7.5",
        "laravel/sanctum": "^3.2"
    }
}
```

---

## 🗄️ DATABASE MIGRATIONS

```php
// database/migrations/2024_01_01_000001_create_users_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->enum('role', ['customer', 'vendor', 'admin'])->default('customer');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->boolean('email_verified')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

---

## ⚙️ CONFIGURATION

### **.env File:**
```env
APP_NAME=UmrahConnect
APP_ENV=production
APP_KEY=base64:generated_key_here
APP_DEBUG=false
APP_URL=https://umrahconnect.in

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=umrahconnect_db
DB_USERNAME=umrahconnect_user
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_here
JWT_TTL=1440

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

---

## 📤 DEPLOYMENT TO CPANEL

### **Directory Structure on cPanel:**
```
public_html/
├── api/                    ← Laravel public folder
│   └── index.php
├── backend/               ← Laravel application
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── vendor/
├── assets/                ← React build assets
├── index.html            ← React entry point
└── .htaccess
```

### **.htaccess for Laravel:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirect API requests to Laravel
    RewriteRule ^api/(.*)$ api/index.php [L]
    
    # Redirect all other requests to React
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>
```

---

## ✅ ADVANTAGES OF LARAVEL

1. **✅ Native cPanel Support** - Works on all PHP hosting
2. **✅ Better Performance** - Optimized for PHP 8.x
3. **✅ Built-in Features** - Auth, validation, ORM
4. **✅ Easy Deployment** - Just upload files
5. **✅ No External Services** - Everything on one server
6. **✅ Lower Costs** - No need for separate backend hosting
7. **✅ Better Security** - Laravel's built-in security features
8. **✅ Easier Maintenance** - Standard PHP hosting tools

---

## 🚀 IMPLEMENTATION TIMELINE

**Total: 11-13 hours**

- **Day 1 (6 hours):** Laravel setup + Auth + Models
- **Day 2 (5 hours):** Controllers + Routes + Testing
- **Day 3 (2 hours):** Frontend integration + Deployment

---

## 🎯 NEXT STEPS

**Should I proceed with Laravel conversion?**

**Option 1:** "Yes, convert to Laravel"
- I'll create complete Laravel backend
- Full API implementation
- Ready for cPanel deployment

**Option 2:** "Show me sample code first"
- I'll create more controller examples
- Show complete implementation

**Option 3:** "Keep Node.js, use Railway"
- Deploy backend to Railway (free)
- Keep current code

**Which option do you prefer?** 🤔
