<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Package;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get admin dashboard data.
     */
    public function dashboard()
    {
        $stats = [
            // User statistics
            'total_users' => User::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_vendors' => User::where('role', 'vendor')->count(),
            'active_users' => User::where('status', 'active')->count(),
            
            // Package statistics
            'total_packages' => Package::count(),
            'active_packages' => Package::where('status', 'active')->count(),
            'pending_packages' => Package::where('status', 'pending')->count(),
            'featured_packages' => Package::where('featured', true)->count(),
            
            // Booking statistics
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
            'cancelled_bookings' => Booking::where('status', 'cancelled')->count(),
            
            // Revenue statistics
            'total_revenue' => Booking::where('payment_status', 'paid')->sum('total_amount'),
            'monthly_revenue' => Booking::where('payment_status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->sum('total_amount'),
            'today_revenue' => Booking::where('payment_status', 'paid')
                ->whereDate('created_at', today())
                ->sum('total_amount'),
            
            // Review statistics
            'total_reviews' => Review::count(),
            'pending_reviews' => Review::where('status', 'pending')->count(),
            'approved_reviews' => Review::where('status', 'approved')->count(),
        ];

        // Recent activities
        $recentBookings = Booking::with(['user', 'package'])
            ->latest()
            ->limit(10)
            ->get();

        $recentUsers = User::latest()
            ->limit(10)
            ->get();

        $pendingPackages = Package::with('vendor')
            ->where('status', 'pending')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_bookings' => $recentBookings,
                'recent_users' => $recentUsers,
                'pending_packages' => $pendingPackages,
            ]
        ]);
    }

    /**
     * Get detailed statistics.
     */
    public function statistics(Request $request)
    {
        $period = $request->get('period', 'month');

        $data = [
            'revenue_chart' => $this->getRevenueChart($period),
            'bookings_chart' => $this->getBookingsChart($period),
            'users_chart' => $this->getUsersChart($period),
            'top_packages' => $this->getTopPackages(),
            'top_vendors' => $this->getTopVendors(),
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Get revenue chart data.
     */
    private function getRevenueChart($period)
    {
        $query = Booking::where('payment_status', 'paid');

        switch ($period) {
            case 'day':
                return $query->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();

            case 'month':
                return $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total_amount) as revenue')
                    ->whereDate('created_at', '>=', now()->subMonths(12))
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

            default:
                return collect();
        }
    }

    /**
     * Get bookings chart data.
     */
    private function getBookingsChart($period)
    {
        $query = Booking::query();

        switch ($period) {
            case 'day':
                return $query->selectRaw('DATE(created_at) as date, COUNT(*) as count, status')
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->groupBy('date', 'status')
                    ->orderBy('date')
                    ->get();

            case 'month':
                return $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count, status')
                    ->whereDate('created_at', '>=', now()->subMonths(12))
                    ->groupBy('year', 'month', 'status')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

            default:
                return collect();
        }
    }

    /**
     * Get users chart data.
     */
    private function getUsersChart($period)
    {
        $query = User::query();

        switch ($period) {
            case 'day':
                return $query->selectRaw('DATE(created_at) as date, COUNT(*) as count, role')
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->groupBy('date', 'role')
                    ->orderBy('date')
                    ->get();

            case 'month':
                return $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count, role')
                    ->whereDate('created_at', '>=', now()->subMonths(12))
                    ->groupBy('year', 'month', 'role')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

            default:
                return collect();
        }
    }

    /**
     * Get top packages.
     */
    private function getTopPackages()
    {
        return Package::withCount('bookings')
            ->withSum('bookings', 'total_amount')
            ->orderBy('bookings_count', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Get top vendors.
     */
    private function getTopVendors()
    {
        return User::where('role', 'vendor')
            ->withCount('packages')
            ->with(['packages' => function($q) {
                $q->withCount('bookings');
            }])
            ->get()
            ->map(function($vendor) {
                return [
                    'id' => $vendor->id,
                    'name' => $vendor->full_name,
                    'email' => $vendor->email,
                    'packages_count' => $vendor->packages_count,
                    'total_bookings' => $vendor->packages->sum('bookings_count'),
                ];
            })
            ->sortByDesc('total_bookings')
            ->take(10)
            ->values();
    }

    /**
     * List all users.
     */
    public function users(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Show user details.
     */
    public function showUser($id)
    {
        $user = User::with(['packages', 'bookings', 'reviews'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update user status.
     */
    public function updateUserStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($id);
        $user->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Delete user.
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting admin users
        if ($user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete admin users'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * List all packages.
     */
    public function packages(Request $request)
    {
        $query = Package::with('vendor');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $packages = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $packages
        ]);
    }

    /**
     * Approve package.
     */
    public function approvePackage($id)
    {
        $package = Package::findOrFail($id);
        $package->update(['status' => 'active']);

        return response()->json([
            'success' => true,
            'message' => 'Package approved successfully',
            'data' => $package
        ]);
    }

    /**
     * Reject package.
     */
    public function rejectPackage(Request $request, $id)
    {
        $package = Package::findOrFail($id);
        $package->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Package rejected successfully',
            'data' => $package
        ]);
    }

    /**
     * Toggle package featured status.
     */
    public function toggleFeatured($id)
    {
        $package = Package::findOrFail($id);
        $package->update(['featured' => !$package->featured]);

        return response()->json([
            'success' => true,
            'message' => 'Package featured status updated',
            'data' => $package
        ]);
    }

    /**
     * List all bookings.
     */
    public function bookings(Request $request)
    {
        $query = Booking::with(['user', 'package']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Show booking details.
     */
    public function showBooking($id)
    {
        $booking = Booking::with(['user', 'package', 'payments'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * List all payments.
     */
    public function payments(Request $request)
    {
        $query = Payment::with(['user', 'booking.package']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * Get settings.
     */
    public function settings()
    {
        $settings = Setting::getAllSettings();

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Update settings.
     */
    public function updateSettings(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully'
        ]);
    }
}
