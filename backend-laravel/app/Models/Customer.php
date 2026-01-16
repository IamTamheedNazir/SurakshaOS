<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'mobile',
        'email',
        'passport_number',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'notes',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get full name.
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get all PNR sales for this customer.
     */
    public function pnrSales()
    {
        return $this->hasMany(PNRSale::class);
    }

    /**
     * Get all bookings for this customer.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get total spent.
     */
    public function getTotalSpentAttribute()
    {
        return $this->pnrSales()->sum('total_selling_price');
    }

    /**
     * Get total bookings count.
     */
    public function getTotalBookingsAttribute()
    {
        return $this->pnrSales()->count() + $this->bookings()->count();
    }

    /**
     * Search customers.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('mobile', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('passport_number', 'like', "%{$search}%");
        });
    }
}
