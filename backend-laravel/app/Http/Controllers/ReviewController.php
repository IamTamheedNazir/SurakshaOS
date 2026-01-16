<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'package'])->approved();

        // Filter by package
        if ($request->has('package_id')) {
            $query->where('package_id', $request->package_id);
        }

        // Filter by rating
        if ($request->has('rating')) {
            $query->rating($request->rating);
        }

        // Filter by verified purchases
        if ($request->has('verified') && $request->verified) {
            $query->verified();
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if user has already reviewed this package
        $existingReview = Review::where('user_id', auth()->id())
            ->where('package_id', $request->package_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this package'
            ], 400);
        }

        // Check if user has booked this package (for verified purchase)
        $verifiedPurchase = false;
        if ($request->booking_id) {
            $booking = Booking::where('id', $request->booking_id)
                ->where('user_id', auth()->id())
                ->where('package_id', $request->package_id)
                ->where('status', 'completed')
                ->first();

            $verifiedPurchase = $booking !== null;
        }

        // Handle image uploads
        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $images[] = $path;
            }
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'package_id' => $request->package_id,
            'booking_id' => $request->booking_id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'images' => $images,
            'verified_purchase' => $verifiedPurchase,
            'status' => 'pending', // Requires admin approval
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully. It will be published after approval.',
            'data' => $review->load(['user', 'package'])
        ], 201);
    }

    /**
     * Display the specified review.
     */
    public function show($id)
    {
        $review = Review::with(['user', 'package', 'booking'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $review
        ]);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Authorization check
        if ($review->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'title' => 'sometimes|string|max:255',
            'comment' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $review->update($request->only(['rating', 'title', 'comment']));
        $review->update(['status' => 'pending']); // Re-approval required

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review
        ]);
    }

    /**
     * Remove the specified review.
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        // Authorization check
        if ($review->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    }

    /**
     * Mark review as helpful.
     */
    public function markHelpful($id)
    {
        $review = Review::findOrFail($id);
        $review->markHelpful();

        return response()->json([
            'success' => true,
            'message' => 'Review marked as helpful',
            'data' => $review
        ]);
    }

    /**
     * Get package rating statistics.
     */
    public function packageStats($packageId)
    {
        $reviews = Review::where('package_id', $packageId)
            ->approved()
            ->get();

        $stats = [
            'total_reviews' => $reviews->count(),
            'average_rating' => round($reviews->avg('rating'), 1),
            'rating_distribution' => [
                '5' => $reviews->where('rating', 5)->count(),
                '4' => $reviews->where('rating', 4)->count(),
                '3' => $reviews->where('rating', 3)->count(),
                '2' => $reviews->where('rating', 2)->count(),
                '1' => $reviews->where('rating', 1)->count(),
            ],
            'verified_purchases' => $reviews->where('verified_purchase', true)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
