<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'colors',
        'fonts',
        'settings',
        'is_active',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'colors' => 'array',
        'fonts' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * Scope to get the active theme
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->first();
    }

    /**
     * Scope to get the default theme
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true)->first();
    }
}
