<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PackageController extends Controller
{
    /**
     * Display a listing of packages.
     */
    public function index(Request $request)
    {
        $query = Package::with(['vendor', 'reviews'])
            ->active();

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('destination', 'like', "%{$search}%");
            });
        }

        // Filter by destination
        if ($request->has('destination')) {
            $query->destination($request->destination);
        }

        // Filter by price range
        if ($request->has('min_price') && $request->has('max_price')) {
            $query->priceRange($request->min_price, $request->max_price);
        }

        // Filter by duration
        if ($request->has('duration')) {
            $query->duration($request->duration);
        }

        // Filter by featured
        if ($request->has('featured') && $request->featured) {
            $query->featured();
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $packages = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $packages
        ]);
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'destination' => 'required|string|max:255',
            'departure_city' => 'nullable|string|max:255',
            'accommodation_type' => 'nullable|string|max:100',
            'transportation_type' => 'nullable|string|max:100',
            'meal_plan' => 'nullable|string|max:100',
            'inclusions' => 'nullable|array',
            'exclusions' => 'nullable|array',
            'itinerary' => 'nullable|array',
            'max_travelers' => 'nullable|integer|min:1',
            'min_travelers' => 'nullable|integer|min:1',
            'available_from' => 'nullable|date',
            'available_to' => 'nullable|date|after:available_from',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $package = Package::create([
            'vendor_id' => auth()->id(),
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'description' => $request->description,
            'price' => $request->price,
            'duration' => $request->duration,
            'destination' => $request->destination,
            'departure_city' => $request->departure_city,
            'accommodation_type' => $request->accommodation_type,
            'transportation_type' => $request->transportation_type,
            'meal_plan' => $request->meal_plan,
            'inclusions' => $request->inclusions ?? [],
            'exclusions' => $request->exclusions ?? [],
            'itinerary' => $request->itinerary ?? [],
            'max_travelers' => $request->max_travelers,
            'min_travelers' => $request->min_travelers,
            'available_from' => $request->available_from,
            'available_to' => $request->available_to,
            'status' => 'pending', // Admin approval required
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Package created successfully',
            'data' => $package
        ], 201);
    }

    /**
     * Display the specified package.
     */
    public function show($id)
    {
        $package = Package::with(['vendor', 'reviews.user'])
            ->findOrFail($id);

        // Increment views
        $package->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $package
        ]);
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        // Authorization check
        if ($package->vendor_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'duration' => 'sometimes|integer|min:1',
            'destination' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:active,inactive,pending',
            'featured' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only([
            'title', 'description', 'price', 'duration', 'destination',
            'departure_city', 'accommodation_type', 'transportation_type',
            'meal_plan', 'inclusions', 'exclusions', 'itinerary',
            'max_travelers', 'min_travelers', 'available_from', 'available_to'
        ]);

        // Only admin can change status and featured
        if (auth()->user()->isAdmin()) {
            if ($request->has('status')) {
                $updateData['status'] = $request->status;
            }
            if ($request->has('featured')) {
                $updateData['featured'] = $request->featured;
            }
        }

        if (isset($updateData['title'])) {
            $updateData['slug'] = Str::slug($updateData['title']);
        }

        $package->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Package updated successfully',
            'data' => $package
        ]);
    }

    /**
     * Remove the specified package.
     */
    public function destroy($id)
    {
        $package = Package::findOrFail($id);

        // Authorization check
        if ($package->vendor_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check if package has active bookings
        if ($package->bookings()->whereIn('status', ['pending', 'confirmed'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete package with active bookings'
            ], 400);
        }

        $package->delete();

        return response()->json([
            'success' => true,
            'message' => 'Package deleted successfully'
        ]);
    }

    /**
     * Get featured packages.
     */
    public function featured()
    {
        $packages = Package::with(['vendor', 'reviews'])
            ->active()
            ->featured()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $packages
        ]);
    }

    /**
     * Get vendor's packages.
     */
    public function vendorPackages()
    {
        $packages = Package::with(['reviews'])
            ->where('vendor_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $packages
        ]);
    }
}
