<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings.
     */
    public function index(Request $request)
    {
        $query = Booking::with(['package', 'user']);

        // Filter by user role
        if (auth()->user()->isCustomer()) {
            $query->forUser(auth()->id());
        } elseif (auth()->user()->isVendor()) {
            $query->forVendor(auth()->id());
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Search by booking number
        if ($request->has('search')) {
            $query->where('booking_number', 'like', "%{$request->search}%");
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $bookings = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'travelers' => 'required|integer|min:1',
            'travel_date' => 'required|date|after:today',
            'special_requests' => 'nullable|string',
            'traveler_details' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $package = Package::findOrFail($request->package_id);

        // Check if package is available
        if (!$package->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Package is not available for booking'
            ], 400);
        }

        // Check travelers limit
        if ($package->max_travelers && $request->travelers > $package->max_travelers) {
            return response()->json([
                'success' => false,
                'message' => "Maximum {$package->max_travelers} travelers allowed"
            ], 400);
        }

        if ($package->min_travelers && $request->travelers < $package->min_travelers) {
            return response()->json([
                'success' => false,
                'message' => "Minimum {$package->min_travelers} travelers required"
            ], 400);
        }

        // Calculate total amount
        $totalAmount = $package->price * $request->travelers;

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'package_id' => $request->package_id,
            'travelers' => $request->travelers,
            'travel_date' => $request->travel_date,
            'total_amount' => $totalAmount,
            'paid_amount' => 0,
            'status' => 'pending',
            'payment_status' => 'pending',
            'special_requests' => $request->special_requests,
            'traveler_details' => $request->traveler_details ?? [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'data' => $booking->load(['package', 'user'])
        ], 201);
    }

    /**
     * Display the specified booking.
     */
    public function show($id)
    {
        $booking = Booking::with(['package', 'user', 'payments'])
            ->findOrFail($id);

        // Authorization check
        if ($booking->user_id !== auth()->id() && 
            !auth()->user()->isAdmin() && 
            $booking->package->vendor_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * Update booking status.
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'cancellation_reason' => 'required_if:status,cancelled|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = Booking::findOrFail($id);

        // Authorization check
        if (!auth()->user()->isAdmin() && 
            $booking->package->vendor_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        switch ($request->status) {
            case 'confirmed':
                $booking->confirm();
                break;
            case 'cancelled':
                $booking->cancel($request->cancellation_reason);
                break;
            case 'completed':
                $booking->complete();
                break;
            default:
                $booking->update(['status' => $request->status]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated successfully',
            'data' => $booking
        ]);
    }

    /**
     * Cancel booking (customer).
     */
    public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        // Authorization check
        if ($booking->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check if booking can be cancelled
        if ($booking->isCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Booking is already cancelled'
            ], 400);
        }

        if ($booking->isCompleted()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel completed booking'
            ], 400);
        }

        $booking->cancel($request->reason);

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully',
            'data' => $booking
        ]);
    }

    /**
     * Get booking statistics.
     */
    public function statistics()
    {
        $query = Booking::query();

        if (auth()->user()->isVendor()) {
            $query->forVendor(auth()->id());
        } elseif (auth()->user()->isCustomer()) {
            $query->forUser(auth()->id());
        }

        $stats = [
            'total' => $query->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'confirmed' => (clone $query)->where('status', 'confirmed')->count(),
            'cancelled' => (clone $query)->where('status', 'cancelled')->count(),
            'completed' => (clone $query)->where('status', 'completed')->count(),
            'total_revenue' => (clone $query)->where('payment_status', 'paid')->sum('total_amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
