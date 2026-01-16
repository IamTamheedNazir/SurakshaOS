<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorProfile extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'business_name',
        'business_registration_number',
        'tax_number',
        'business_address',
        'business_city',
        'business_state',
        'business_country',
        'business_postal_code',
        'business_phone',
        'business_email',
        'website',
        'description',
        'logo',
        'banner_image',
        'social_links',
        'bank_account_name',
        'bank_account_number',
        'bank_name',
        'bank_branch',
        'bank_ifsc_code',
        'commission_rate',
        'status',
        'verified',
        'verified_at',
        'documents',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'verified' => 'boolean',
        'verified_at' => 'datetime',
        'commission_rate' => 'decimal:2',
        'social_links' => 'array',
        'documents' => 'array',
    ];

    /**
     * Get the user that owns the vendor profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if vendor is verified.
     */
    public function isVerified(): bool
    {
        return $this->verified === true;
    }

    /**
     * Check if vendor is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Verify the vendor.
     */
    public function verify()
    {
        $this->update([
            'verified' => true,
            'verified_at' => now(),
            'status' => 'active',
        ]);
    }

    /**
     * Suspend the vendor.
     */
    public function suspend()
    {
        $this->update([
            'status' => 'suspended',
        ]);
    }

    /**
     * Scope a query to only include verified vendors.
     */
    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }

    /**
     * Scope a query to only include active vendors.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
