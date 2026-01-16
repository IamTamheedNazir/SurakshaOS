<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Booking;
use App\Models\VendorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class VendorController extends Controller
{
    /**
     * Get vendor dashboard data.
     */
    public function dashboard()
    {
        $vendorId = auth()->id();

        $stats = [
            'total_packages' => Package::where('vendor_id', $vendorId)->count(),
            'active_packages' => Package::where('vendor_id', $vendorId)->where('status', 'active')->count(),
            'pending_packages' => Package::where('vendor_id', $vendorId)->where('status', 'pending')->count(),
            
            'total_bookings' => Booking::whereHas('package', function($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })->count(),
            
            'pending_bookings' => Booking::whereHas('package', function($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })->where('status', 'pending')->count(),
            
            'confirmed_bookings' => Booking::whereHas('package', function($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })->where('status', 'confirmed')->count(),
            
            'total_revenue' => Booking::whereHas('package', function($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })->where('payment_status', 'paid')->sum('total_amount'),
            
            'monthly_revenue' => Booking::whereHas('package', function($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })
            ->where('payment_status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->sum('total_amount'),
        ];

        // Recent bookings
        $recentBookings = Booking::with(['package', 'user'])
            ->whereHas('package', function($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })
            ->latest()
            ->limit(10)
            ->get();

        // Top packages
        $topPackages = Package::where('vendor_id', $vendorId)
            ->withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_bookings' => $recentBookings,
                'top_packages' => $topPackages,
            ]
        ]);
    }

    /**
     * Get vendor bookings.
     */
    public function bookings(Request $request)
    {
        $query = Booking::with(['package', 'user', 'payment'])
            ->whereHas('package', function($q) {
                $q->where('vendor_id', auth()->id());
            });

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Date range filter
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $bookings = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Get vendor statistics.
     */
    public function statistics(Request $request)
    {
        $vendorId = auth()->id();
        $period = $request->get('period', 'month'); // day, week, month, year

        // Revenue over time
        $revenueData = $this->getRevenueData($vendorId, $period);

        // Bookings over time
        $bookingsData = $this->getBookingsData($vendorId, $period);

        // Package performance
        $packagePerformance = Package::where('vendor_id', $vendorId)
            ->withCount('bookings')
            ->withSum('bookings', 'total_amount')
            ->get()
            ->map(function($package) {
                return [
                    'id' => $package->id,
                    'title' => $package->title,
                    'bookings_count' => $package->bookings_count,
                    'total_revenue' => $package->bookings_sum_total_amount ?? 0,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'revenue_chart' => $revenueData,
                'bookings_chart' => $bookingsData,
                'package_performance' => $packagePerformance,
            ]
        ]);
    }

    /**
     * Get revenue data for charts.
     */
    private function getRevenueData($vendorId, $period)
    {
        $query = Booking::whereHas('package', function($q) use ($vendorId) {
            $q->where('vendor_id', $vendorId);
        })->where('payment_status', 'paid');

        switch ($period) {
            case 'day':
                return $query->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();

            case 'week':
                return $query->selectRaw('YEARWEEK(created_at) as week, SUM(total_amount) as revenue')
                    ->whereDate('created_at', '>=', now()->subWeeks(12))
                    ->groupBy('week')
                    ->orderBy('week')
                    ->get();

            case 'month':
                return $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total_amount) as revenue')
                    ->whereDate('created_at', '>=', now()->subMonths(12))
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

            case 'year':
                return $query->selectRaw('YEAR(created_at) as year, SUM(total_amount) as revenue')
                    ->groupBy('year')
                    ->orderBy('year')
                    ->get();

            default:
                return collect();
        }
    }

    /**
     * Get bookings data for charts.
     */
    private function getBookingsData($vendorId, $period)
    {
        $query = Booking::whereHas('package', function($q) use ($vendorId) {
            $q->where('vendor_id', $vendorId);
        });

        switch ($period) {
            case 'day':
                return $query->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();

            case 'week':
                return $query->selectRaw('YEARWEEK(created_at) as week, COUNT(*) as count')
                    ->whereDate('created_at', '>=', now()->subWeeks(12))
                    ->groupBy('week')
                    ->orderBy('week')
                    ->get();

            case 'month':
                return $query->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
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
     * Get vendor profile.
     */
    public function profile()
    {
        $profile = VendorProfile::where('user_id', auth()->id())->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor profile not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }

    /**
     * Update vendor profile.
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'business_name' => 'sometimes|string|max:255',
            'business_registration_number' => 'sometimes|string|max:100',
            'tax_number' => 'sometimes|string|max:100',
            'business_address' => 'sometimes|string',
            'business_phone' => 'sometimes|string|max:20',
            'business_email' => 'sometimes|email',
            'website' => 'sometimes|url',
            'description' => 'sometimes|string',
            'bank_account_name' => 'sometimes|string|max:255',
            'bank_account_number' => 'sometimes|string|max:50',
            'bank_name' => 'sometimes|string|max:255',
            'bank_ifsc_code' => 'sometimes|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $profile = VendorProfile::updateOrCreate(
            ['user_id' => auth()->id()],
            $request->all()
        );

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $profile
        ]);
    }
}
