<?php

namespace App\Http\Controllers;

use App\Models\PNRInventory;
use App\Models\PNRSale;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PNRInventoryController extends Controller
{
    /**
     * Get inventory dashboard.
     */
    public function dashboard()
    {
        $agentId = auth()->id();

        // Summary cards
        $stats = [
            'active_pnr_blocks' => PNRInventory::where('agent_id', $agentId)->active()->count(),
            'total_seats_purchased' => PNRInventory::where('agent_id', $agentId)->sum('total_seats'),
            'seats_sold' => PNRInventory::where('agent_id', $agentId)->sum('sold_seats'),
            'seats_remaining' => PNRInventory::where('agent_id', $agentId)->active()->sum('remaining_seats'),
            'inventory_value' => PNRInventory::where('agent_id', $agentId)->active()->sum('total_buying_price'),
            'total_profit' => PNRSale::where('agent_id', $agentId)->sum('profit'),
            'loss_from_expired' => PNRInventory::where('agent_id', $agentId)
                ->expired()
                ->get()
                ->sum('loss_from_unsold'),
        ];

        // Expiry warnings
        $expiryWarnings = PNRInventory::where('agent_id', $agentId)
            ->active()
            ->where('expiry_datetime', '<=', now()->addHours(6))
            ->where('expiry_datetime', '>', now())
            ->get()
            ->map(function($pnr) {
                return [
                    'id' => $pnr->id,
                    'pnr_code' => $pnr->pnr_code,
                    'flight' => "{$pnr->airline_name} {$pnr->flight_number}",
                    'route' => "{$pnr->from_city_code} → {$pnr->to_city_code}",
                    'hours_left' => $pnr->getHoursUntilExpiry(),
                    'remaining_seats' => $pnr->remaining_seats,
                    'potential_loss' => $pnr->remaining_seats * $pnr->buying_price_per_seat,
                    'urgent' => $pnr->needsUrgentWarning(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'expiry_warnings' => $expiryWarnings,
            ]
        ]);
    }

    /**
     * List all inventory.
     */
    public function index(Request $request)
    {
        $query = PNRInventory::with(['agent', 'sales'])
            ->where('agent_id', auth()->id());

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'expired') {
                $query->expired();
            } elseif ($request->status === 'sold_out') {
                $query->soldOut();
            }
        }

        // Filter by route
        if ($request->has('from') && $request->has('to')) {
            $query->route($request->from, $request->to);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->byDate($request->date);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('pnr_code', 'like', "%{$search}%")
                  ->orWhere('flight_number', 'like', "%{$search}%")
                  ->orWhere('airline_name', 'like', "%{$search}%");
            });
        }

        $inventory = $query->latest()->paginate(15);

        // Add calculated fields
        $inventory->getCollection()->transform(function($pnr) {
            return [
                'id' => $pnr->id,
                'pnr_code' => $pnr->pnr_code,
                'airline' => $pnr->airline_name,
                'flight' => $pnr->flight_number,
                'route' => "{$pnr->from_city_code} → {$pnr->to_city_code}",
                'departure_date' => $pnr->departure_date->format('d M Y'),
                'departure_time' => Carbon::parse($pnr->departure_time)->format('H:i'),
                'expiry' => $pnr->expiry_datetime->format('d M Y H:i'),
                'hours_until_expiry' => $pnr->getHoursUntilExpiry(),
                'seats' => "{$pnr->sold_seats} / {$pnr->total_seats}",
                'remaining' => $pnr->remaining_seats,
                'buying_price' => $pnr->buying_price_per_seat,
                'avg_selling_price' => $pnr->average_selling_price,
                'total_revenue' => $pnr->total_revenue,
                'profit' => $pnr->total_profit,
                'status' => $pnr->status,
                'is_active' => $pnr->isActive(),
                'needs_warning' => $pnr->needsExpiryWarning(),
                'needs_urgent_warning' => $pnr->needsUrgentWarning(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $inventory
        ]);
    }

    /**
     * Add PNR to inventory (Manual Entry).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pnr_code' => 'required|string|max:20',
            'airline_name' => 'required|string|max:100',
            'airline_code' => 'nullable|string|max:10',
            'flight_number' => 'required|string|max:20',
            'from_city' => 'required|string|max:100',
            'from_city_code' => 'required|string|max:10',
            'to_city' => 'required|string|max:100',
            'to_city_code' => 'required|string|max:10',
            'departure_date' => 'required|date|after:today',
            'departure_time' => 'required|date_format:H:i',
            'arrival_date' => 'required|date|after_or_equal:departure_date',
            'arrival_time' => 'required|date_format:H:i',
            'total_seats' => 'required|integer|min:1',
            'buying_price_per_seat' => 'required|numeric|min:1',
            'expiry_datetime' => 'required|date|after:now|before:departure_date',
            'supplier_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if PNR already exists for this date
        $exists = PNRInventory::where('pnr_code', $request->pnr_code)
            ->whereDate('departure_date', $request->departure_date)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'PNR already exists for this travel date'
            ], 400);
        }

        // Create inventory
        $inventory = PNRInventory::create([
            'agent_id' => auth()->id(),
            'pnr_code' => strtoupper($request->pnr_code),
            'airline_name' => $request->airline_name,
            'airline_code' => $request->airline_code,
            'flight_number' => $request->flight_number,
            'from_city' => $request->from_city,
            'from_city_code' => strtoupper($request->from_city_code),
            'to_city' => $request->to_city,
            'to_city_code' => strtoupper($request->to_city_code),
            'departure_date' => $request->departure_date,
            'departure_time' => $request->departure_time,
            'arrival_date' => $request->arrival_date,
            'arrival_time' => $request->arrival_time,
            'total_seats' => $request->total_seats,
            'buying_price_per_seat' => $request->buying_price_per_seat,
            'expiry_datetime' => $request->expiry_datetime,
            'supplier_name' => $request->supplier_name,
            'notes' => $request->notes,
            'entry_type' => 'manual',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'PNR added to inventory successfully',
            'data' => $inventory
        ], 201);
    }

    /**
     * Get PNR details.
     */
    public function show($id)
    {
        $pnr = PNRInventory::with(['agent', 'sales.customer'])
            ->findOrFail($id);

        // Authorization check
        if ($pnr->agent_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'pnr' => $pnr,
                'stats' => [
                    'total_revenue' => $pnr->total_revenue,
                    'total_profit' => $pnr->total_profit,
                    'average_selling_price' => $pnr->average_selling_price,
                    'hours_until_expiry' => $pnr->getHoursUntilExpiry(),
                ],
                'sales' => $pnr->sales,
            ]
        ]);
    }

    /**
     * Update PNR inventory.
     */
    public function update(Request $request, $id)
    {
        $pnr = PNRInventory::findOrFail($id);

        // Authorization check
        if ($pnr->agent_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Can only update if no sales yet
        if ($pnr->sold_seats > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update PNR with existing sales'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'total_seats' => 'sometimes|integer|min:1',
            'buying_price_per_seat' => 'sometimes|numeric|min:1',
            'expiry_datetime' => 'sometimes|date|after:now',
            'supplier_name' => 'sometimes|string|max:255',
            'notes' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $pnr->update($request->only([
            'total_seats', 'buying_price_per_seat', 'expiry_datetime',
            'supplier_name', 'notes'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'PNR updated successfully',
            'data' => $pnr
        ]);
    }

    /**
     * Delete PNR inventory.
     */
    public function destroy($id)
    {
        $pnr = PNRInventory::findOrFail($id);

        // Authorization check
        if ($pnr->agent_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Can only delete if no sales
        if ($pnr->sold_seats > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete PNR with existing sales'
            ], 400);
        }

        $pnr->delete();

        return response()->json([
            'success' => true,
            'message' => 'PNR deleted successfully'
        ]);
    }

    /**
     * Check and mark expired PNRs (Cron job).
     */
    public function checkExpired()
    {
        $expired = PNRInventory::active()
            ->where('expiry_datetime', '<=', now())
            ->get();

        foreach ($expired as $pnr) {
            $pnr->markAsExpired();
            
            // TODO: Send alert to agent and manager
            // TODO: Log loss in accounting
        }

        return response()->json([
            'success' => true,
            'message' => "{$expired->count()} PNRs marked as expired",
            'data' => $expired
        ]);
    }

    /**
     * Get expiry warnings.
     */
    public function expiryWarnings()
    {
        $warnings = PNRInventory::where('agent_id', auth()->id())
            ->active()
            ->where('expiry_datetime', '<=', now()->addHours(6))
            ->where('expiry_datetime', '>', now())
            ->get();

        return response()->json([
            'success' => true,
            'data' => $warnings->map(function($pnr) {
                return [
                    'id' => $pnr->id,
                    'pnr_code' => $pnr->pnr_code,
                    'flight' => "{$pnr->airline_name} {$pnr->flight_number}",
                    'route' => "{$pnr->from_city_code} → {$pnr->to_city_code}",
                    'hours_left' => $pnr->getHoursUntilExpiry(),
                    'remaining_seats' => $pnr->remaining_seats,
                    'potential_loss' => $pnr->remaining_seats * $pnr->buying_price_per_seat,
                    'urgent' => $pnr->needsUrgentWarning(),
                ];
            })
        ]);
    }
}
