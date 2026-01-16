<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PNRSale extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'pnr_sales';

    protected $fillable = [
        'pnr_inventory_id',
        'agent_id',
        'customer_id',
        'booking_reference',
        'seats_sold',
        'selling_price_per_seat',
        'total_selling_price',
        'buying_price_per_seat',
        'total_buying_price',
        'profit',
        'sale_channel', // walk-in, website, makemytrip, easemytrip, corporate, sub-agent
        'payment_status', // paid, pending, partially_paid
        'paid_amount',
        'pending_amount',
        'invoice_number',
        'voucher_path',
        'voucher_sent_email',
        'voucher_sent_whatsapp',
        'notes',
    ];

    protected $casts = [
        'seats_sold' => 'integer',
        'selling_price_per_seat' => 'decimal:2',
        'total_selling_price' => 'decimal:2',
        'buying_price_per_seat' => 'decimal:2',
        'total_buying_price' => 'decimal:2',
        'profit' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'pending_amount' => 'decimal:2',
        'voucher_sent_email' => 'boolean',
        'voucher_sent_whatsapp' => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($sale) {
            // Auto calculate totals and profit
            $sale->total_selling_price = $sale->seats_sold * $sale->selling_price_per_seat;
            $sale->total_buying_price = $sale->seats_sold * $sale->buying_price_per_seat;
            $sale->profit = $sale->total_selling_price - $sale->total_buying_price;
            
            // Calculate pending amount
            $sale->pending_amount = $sale->total_selling_price - ($sale->paid_amount ?? 0);
            
            // Generate booking reference
            if (empty($sale->booking_reference)) {
                $sale->booking_reference = 'YTW' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 10));
            }
            
            // Generate invoice number
            if (empty($sale->invoice_number)) {
                $sale->invoice_number = 'INV-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 6));
            }
        });
    }

    /**
     * Get the PNR inventory.
     */
    public function pnrInventory()
    {
        return $this->belongsTo(PNRInventory::class, 'pnr_inventory_id');
    }

    /**
     * Get the agent who made the sale.
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    /**
     * Get the customer.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    /**
     * Check if fully paid.
     */
    public function isFullyPaid(): bool
    {
        return $this->payment_status === 'paid' && $this->pending_amount <= 0;
    }

    /**
     * Check if payment pending.
     */
    public function isPaymentPending(): bool
    {
        return $this->payment_status === 'pending' || $this->pending_amount > 0;
    }

    /**
     * Mark as paid.
     */
    public function markAsPaid()
    {
        $this->update([
            'payment_status' => 'paid',
            'paid_amount' => $this->total_selling_price,
            'pending_amount' => 0,
        ]);
    }

    /**
     * Record partial payment.
     */
    public function recordPayment($amount)
    {
        $newPaidAmount = $this->paid_amount + $amount;
        $newPendingAmount = $this->total_selling_price - $newPaidAmount;

        $this->update([
            'paid_amount' => $newPaidAmount,
            'pending_amount' => $newPendingAmount,
            'payment_status' => $newPendingAmount <= 0 ? 'paid' : 'partially_paid',
        ]);
    }

    /**
     * Scope by payment status.
     */
    public function scopePaymentStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    /**
     * Scope by sale channel.
     */
    public function scopeSaleChannel($query, $channel)
    {
        return $query->where('sale_channel', $channel);
    }

    /**
     * Scope by agent.
     */
    public function scopeByAgent($query, $agentId)
    {
        return $query->where('agent_id', $agentId);
    }
}
