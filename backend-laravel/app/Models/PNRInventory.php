<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PNRInventory extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'pnr_inventory';

    protected $fillable = [
        'agent_id',
        'pnr_code',
        'airline_name',
        'airline_code',
        'flight_number',
        'from_city',
        'from_city_code',
        'to_city',
        'to_city_code',
        'departure_date',
        'departure_time',
        'arrival_date',
        'arrival_time',
        'total_seats',
        'sold_seats',
        'remaining_seats',
        'buying_price_per_seat',
        'total_buying_price',
        'expiry_datetime',
        'supplier_name',
        'notes',
        'status', // active, sold_out, expired
        'entry_type', // search, manual
    ];

    protected $casts = [
        'departure_date' => 'date',
        'arrival_date' => 'date',
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'expiry_datetime' => 'datetime',
        'total_seats' => 'integer',
        'sold_seats' => 'integer',
        'remaining_seats' => 'integer',
        'buying_price_per_seat' => 'decimal:2',
        'total_buying_price' => 'decimal:2',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($inventory) {
            $inventory->sold_seats = 0;
            $inventory->remaining_seats = $inventory->total_seats;
            $inventory->total_buying_price = $inventory->total_seats * $inventory->buying_price_per_seat;
            $inventory->status = 'active';
        });
    }

    /**
     * Get the agent who added this inventory.
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    /**
     * Get all sales from this PNR.
     */
    public function sales()
    {
        return $this->hasMany(PNRSale::class, 'pnr_inventory_id');
    }

    /**
     * Check if PNR is expired.
     */
    public function isExpired(): bool
    {
        return now()->gt($this->expiry_datetime);
    }

    /**
     * Check if PNR is sold out.
     */
    public function isSoldOut(): bool
    {
        return $this->remaining_seats <= 0;
    }

    /**
     * Check if PNR is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && !$this->isExpired() && !$this->isSoldOut();
    }

    /**
     * Get hours until expiry.
     */
    public function getHoursUntilExpiry()
    {
        return now()->diffInHours($this->expiry_datetime, false);
    }

    /**
     * Check if expiry warning needed.
     */
    public function needsExpiryWarning(): bool
    {
        $hours = $this->getHoursUntilExpiry();
        return $hours > 0 && $hours <= 6;
    }

    /**
     * Check if urgent expiry warning needed.
     */
    public function needsUrgentWarning(): bool
    {
        $hours = $this->getHoursUntilExpiry();
        return $hours > 0 && $hours <= 2;
    }

    /**
     * Mark as expired.
     */
    public function markAsExpired()
    {
        $this->update(['status' => 'expired']);
    }

    /**
     * Mark as sold out.
     */
    public function markAsSoldOut()
    {
        $this->update(['status' => 'sold_out']);
    }

    /**
     * Sell seats.
     */
    public function sellSeats($quantity)
    {
        $this->increment('sold_seats', $quantity);
        $this->decrement('remaining_seats', $quantity);

        if ($this->remaining_seats <= 0) {
            $this->markAsSoldOut();
        }
    }

    /**
     * Get total revenue from sales.
     */
    public function getTotalRevenueAttribute()
    {
        return $this->sales()->sum('total_selling_price');
    }

    /**
     * Get total profit.
     */
    public function getTotalProfitAttribute()
    {
        return $this->total_revenue - ($this->sold_seats * $this->buying_price_per_seat);
    }

    /**
     * Get average selling price.
     */
    public function getAverageSellingPriceAttribute()
    {
        if ($this->sold_seats == 0) return 0;
        return $this->total_revenue / $this->sold_seats;
    }

    /**
     * Get loss from unsold seats.
     */
    public function getLossFromUnsoldAttribute()
    {
        if ($this->status !== 'expired') return 0;
        return $this->remaining_seats * $this->buying_price_per_seat;
    }

    /**
     * Scope active PNRs.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('expiry_datetime', '>', now());
    }

    /**
     * Scope expired PNRs.
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'expired')
            ->orWhere('expiry_datetime', '<=', now());
    }

    /**
     * Scope sold out PNRs.
     */
    public function scopeSoldOut($query)
    {
        return $query->where('status', 'sold_out');
    }

    /**
     * Scope by route.
     */
    public function scopeRoute($query, $from, $to)
    {
        return $query->where('from_city_code', $from)
            ->where('to_city_code', $to);
    }

    /**
     * Scope by date.
     */
    public function scopeByDate($query, $date)
    {
        return $query->whereDate('departure_date', $date);
    }
}
