<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    /**
     * Get all active testimonials (public)
     */
    public function index(Request $request)
    {
        try {
            $query = Testimonial::active();

            // Get featured only
            if ($request->has('featured') && $request->featured) {
                $query = Testimonial::featured();
            }

            // Limit results
            $limit = $request->get('limit', 10);
            $testimonials = $query->limit($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $testimonials
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch testimonials',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all testimonials (admin)
     */
    public function all(Request $request)
    {
        try {
            $query = Testimonial::query();

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active);
            }

            // Filter by featured status
            if ($request->has('is_featured')) {
                $query->where('is_featured', $request->is_featured);
            }

            $testimonials = $query->orderBy('order')->get();

            return response()->json([
                'success' => true,
                'data' => $testimonials
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch testimonials',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single testimonial
     */
    public function show($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create new testimonial (admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'image' => 'nullable|string',
            'designation' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $testimonial = Testimonial::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Testimonial created successfully',
                'data' => $testimonial
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update testimonial (admin)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email',
            'image' => 'nullable|string',
            'designation' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'sometimes|required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Testimonial updated successfully',
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete testimonial (admin)
     */
    public function destroy($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->delete();

            return response()->json([
                'success' => true,
                'message' => 'Testimonial deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle testimonial active status (admin)
     */
    public function toggleActive($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->is_active = !$testimonial->is_active;
            $testimonial->save();

            return response()->json([
                'success' => true,
                'message' => 'Testimonial status updated successfully',
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update testimonial status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle testimonial featured status (admin)
     */
    public function toggleFeatured($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->is_featured = !$testimonial->is_featured;
            $testimonial->save();

            return response()->json([
                'success' => true,
                'message' => 'Testimonial featured status updated successfully',
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update testimonial featured status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
