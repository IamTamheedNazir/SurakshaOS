<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ThemeController extends Controller
{
    /**
     * Get active theme (public)
     */
    public function active()
    {
        try {
            $theme = Theme::active();

            if (!$theme) {
                $theme = Theme::default();
            }

            return response()->json([
                'success' => true,
                'data' => $theme
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch active theme',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all themes (admin)
     */
    public function index()
    {
        try {
            $themes = Theme::all();

            return response()->json([
                'success' => true,
                'data' => $themes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch themes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single theme
     */
    public function show($id)
    {
        try {
            $theme = Theme::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $theme
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Theme not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create new theme (admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'colors' => 'nullable|array',
            'fonts' => 'nullable|array',
            'settings' => 'nullable|array',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();
            $data['slug'] = Str::slug($request->name);

            // If setting as active, deactivate others
            if ($request->is_active) {
                Theme::where('is_active', true)->update(['is_active' => false]);
            }

            // If setting as default, remove default from others
            if ($request->is_default) {
                Theme::where('is_default', true)->update(['is_default' => false]);
            }

            $theme = Theme::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Theme created successfully',
                'data' => $theme
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create theme',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update theme (admin)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'colors' => 'nullable|array',
            'fonts' => 'nullable|array',
            'settings' => 'nullable|array',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $theme = Theme::findOrFail($id);
            
            $data = $request->all();
            if ($request->has('name')) {
                $data['slug'] = Str::slug($request->name);
            }

            // If setting as active, deactivate others
            if ($request->is_active) {
                Theme::where('id', '!=', $id)
                    ->where('is_active', true)
                    ->update(['is_active' => false]);
            }

            // If setting as default, remove default from others
            if ($request->is_default) {
                Theme::where('id', '!=', $id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $theme->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Theme updated successfully',
                'data' => $theme
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update theme',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete theme (admin)
     */
    public function destroy($id)
    {
        try {
            $theme = Theme::findOrFail($id);

            // Don't allow deleting active or default theme
            if ($theme->is_active || $theme->is_default) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete active or default theme'
                ], 400);
            }

            $theme->delete();

            return response()->json([
                'success' => true,
                'message' => 'Theme deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete theme',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate theme (admin)
     */
    public function activate($id)
    {
        try {
            // Deactivate all themes
            Theme::where('is_active', true)->update(['is_active' => false]);

            // Activate selected theme
            $theme = Theme::findOrFail($id);
            $theme->is_active = true;
            $theme->save();

            return response()->json([
                'success' => true,
                'message' => 'Theme activated successfully',
                'data' => $theme
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to activate theme',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
