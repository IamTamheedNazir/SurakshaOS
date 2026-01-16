<?php

namespace App\Http\Controllers;

use App\Models\PNRInventory;
use App\Models\PNRSale;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PDF; // You'll need to install: composer require barryvdh/laravel-dompdf

class PNRSaleController extends Controller
{
    /**
     * Sell seats from PNR inventory.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pnr_inventory_id' => 'required|exists:pnr_inventory,id',
            
            // Customer details
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'mobile' => 'required|string|max:20',
            'email' => 'nullable|email',
            'passport_number' => 'nullable|string|max:50',
            
            // Sale details
            'seats_sold' => 'required|integer|min:1',
            'selling_price_per_seat' => 'required|numeric|min:1',
            'sale_channel' => 'required|in:walk-in,website,makemytrip,easemytrip,corporate,sub-agent',
            'payment_status' => 'required|in:paid,pending,partially_paid',
            'paid_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $pnr = PNRInventory::findOrFail($request->pnr_inventory_id);

        // Check if PNR is active
        if (!$pnr->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'PNR is not active. It may be expired or sold out.'
            ], 400);
        }

        // Check if enough seats available
        if ($request->seats_sold > $pnr->remaining_seats) {
            return response()->json([
                'success' => false,
                'message' => "Only {$pnr->remaining_seats} seats available"
            ], 400);
        }

        // Check selling price vs buying price
        if ($request->selling_price_per_seat < $pnr->buying_price_per_seat) {
            // Require manager approval (you can add this logic)
            return response()->json([
                'success' => false,
                'message' => 'Selling price is below buying price. Manager approval required.'
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Find or create customer
            $customer = Customer::where('mobile', $request->mobile)->first();
            
            if (!$customer) {
                $customer = Customer::create([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'mobile' => $request->mobile,
                    'email' => $request->email,
                    'passport_number' => $request->passport_number,
                ]);
            }

            // Create sale
            $sale = PNRSale::create([
                'pnr_inventory_id' => $pnr->id,
                'agent_id' => auth()->id(),
                'customer_id' => $customer->id,
                'seats_sold' => $request->seats_sold,
                'selling_price_per_seat' => $request->selling_price_per_seat,
                'buying_price_per_seat' => $pnr->buying_price_per_seat,
                'sale_channel' => $request->sale_channel,
                'payment_status' => $request->payment_status,
                'paid_amount' => $request->paid_amount ?? 0,
                'notes' => $request->notes,
            ]);

            // Update PNR inventory
            $pnr->sellSeats($request->seats_sold);

            // Generate voucher PDF
            $voucherPath = $this->generateVoucher($sale, $pnr, $customer);
            $sale->update(['voucher_path' => $voucherPath]);

            // Send voucher via email
            if ($customer->email) {
                $this->sendVoucherEmail($sale, $customer, $voucherPath);
                $sale->update(['voucher_sent_email' => true]);
            }

            // Send voucher via WhatsApp (if enabled)
            if ($customer->mobile) {
                $this->sendVoucherWhatsApp($sale, $customer, $voucherPath);
                $sale->update(['voucher_sent_whatsapp' => true]);
            }

            // TODO: Create invoice with GST
            // TODO: Create accounting ledger entries
            // TODO: Track receivables if payment pending

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Seats sold successfully',
                'data' => [
                    'sale' => $sale->load(['customer', 'pnrInventory']),
                    'voucher_url' => Storage::url($voucherPath),
                    'download_url' => route('pnr-sales.download-voucher', $sale->id),
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to process sale',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate voucher PDF.
     */
    private function generateVoucher($sale, $pnr, $customer)
    {
        $data = [
            'customer' => $customer,
            'sale' => $sale,
            'pnr' => $pnr,
            'booking_reference' => $sale->booking_reference,
            'pnr_code' => $pnr->pnr_code,
            'airline' => $pnr->airline_name,
            'flight_number' => $pnr->flight_number,
            'from' => $pnr->from_city,
            'to' => $pnr->to_city,
            'departure_date' => $pnr->departure_date->format('d F Y'),
            'departure_time' => \Carbon\Carbon::parse($pnr->departure_time)->format('H:i'),
            'arrival_date' => $pnr->arrival_date->format('d F Y'),
            'arrival_time' => \Carbon\Carbon::parse($pnr->arrival_time)->format('H:i'),
            'passengers' => $sale->seats_sold,
            'total_amount' => $sale->total_selling_price,
            'payment_status' => $sale->payment_status,
            'booking_date' => $sale->created_at->format('d F Y'),
        ];

        $pdf = PDF::loadView('vouchers.flight-booking', $data);
        
        $filename = "voucher-{$sale->booking_reference}.pdf";
        $path = "vouchers/{$filename}";
        
        Storage::put($path, $pdf->output());
        
        return $path;
    }

    /**
     * Send voucher via email.
     */
    private function sendVoucherEmail($sale, $customer, $voucherPath)
    {
        // TODO: Implement email sending
        // Use Laravel Mail with attachment
        
        /*
        Mail::to($customer->email)->send(new VoucherMail([
            'customer' => $customer,
            'sale' => $sale,
            'voucher_path' => storage_path('app/' . $voucherPath),
        ]));
        */
    }

    /**
     * Send voucher via WhatsApp.
     */
    private function sendVoucherWhatsApp($sale, $customer, $voucherPath)
    {
        // TODO: Implement WhatsApp sending
        // Use WhatsApp Business API or Twilio
        
        /*
        $whatsapp = new WhatsAppService();
        $whatsapp->sendDocument(
            $customer->mobile,
            storage_path('app/' . $voucherPath),
            "Your flight booking confirmation for {$sale->booking_reference}"
        );
        */
    }

    /**
     * Download voucher.
     */
    public function downloadVoucher($id)
    {
        $sale = PNRSale::findOrFail($id);

        // Authorization check
        if ($sale->agent_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$sale->voucher_path || !Storage::exists($sale->voucher_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher not found'
            ], 404);
        }

        return Storage::download($sale->voucher_path, "voucher-{$sale->booking_reference}.pdf");
    }

    /**
     * Resend voucher via email.
     */
    public function resendEmail($id)
    {
        $sale = PNRSale::with(['customer'])->findOrFail($id);

        if (!$sale->customer->email) {
            return response()->json([
                'success' => false,
                'message' => 'Customer email not available'
            ], 400);
        }

        $this->sendVoucherEmail($sale, $sale->customer, $sale->voucher_path);

        return response()->json([
            'success' => true,
            'message' => 'Voucher sent via email successfully'
        ]);
    }

    /**
     * Resend voucher via WhatsApp.
     */
    public function resendWhatsApp($id)
    {
        $sale = PNRSale::with(['customer'])->findOrFail($id);

        $this->sendVoucherWhatsApp($sale, $sale->customer, $sale->voucher_path);

        return response()->json([
            'success' => true,
            'message' => 'Voucher sent via WhatsApp successfully'
        ]);
    }

    /**
     * List all sales.
     */
    public function index(Request $request)
    {
        $query = PNRSale::with(['customer', 'pnrInventory', 'agent']);

        // Filter by agent
        if (!auth()->user()->isAdmin()) {
            $query->where('agent_id', auth()->id());
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->paymentStatus($request->payment_status);
        }

        // Filter by sale channel
        if ($request->has('sale_channel')) {
            $query->saleChannel($request->sale_channel);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('booking_reference', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($cq) use ($search) {
                      $cq->where('first_name', 'like', "%{$search}%")
                         ->orWhere('last_name', 'like', "%{$search}%")
                         ->orWhere('mobile', 'like', "%{$search}%");
                  });
            });
        }

        $sales = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $sales
        ]);
    }

    /**
     * Get sale details.
     */
    public function show($id)
    {
        $sale = PNRSale::with(['customer', 'pnrInventory', 'agent'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $sale
        ]);
    }

    /**
     * Update payment status.
     */
    public function updatePayment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sale = PNRSale::findOrFail($id);
        $sale->recordPayment($request->payment_amount);

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully',
            'data' => $sale
        ]);
    }
}
