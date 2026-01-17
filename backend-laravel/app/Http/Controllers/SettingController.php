<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Get all settings (public - only public settings)
     */
    public function index()
    {
        try {
            $settings = Setting::where('type', 'public')
                ->orWhere('type', 'general')
                ->get()
                ->pluck('value', 'key');

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all settings (admin - including private)
     */
    public function all()
    {
        try {
            $settings = Setting::all();

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single setting by key
     */
    public function show($key)
    {
        try {
            $setting = Setting::where('key', $key)->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create or update setting (admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255',
            'value' => 'required',
            'type' => 'nullable|in:general,public,private',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $setting = Setting::updateOrCreate(
                ['key' => $request->key],
                [
                    'value' => $request->value,
                    'type' => $request->type ?? 'general'
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Setting saved successfully',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update multiple settings at once (admin)
     */
    public function updateBulk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required',
            'settings.*.type' => 'nullable|in:general,public,private',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updated = [];

            foreach ($request->settings as $settingData) {
                $setting = Setting::updateOrCreate(
                    ['key' => $settingData['key']],
                    [
                        'value' => $settingData['value'],
                        'type' => $settingData['type'] ?? 'general'
                    ]
                );
                $updated[] = $setting;
            }

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => $updated
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete setting (admin)
     */
    public function destroy($key)
    {
        try {
            $setting = Setting::where('key', $key)->firstOrFail();
            $setting->delete();

            return response()->json([
                'success' => true,
                'message' => 'Setting deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
