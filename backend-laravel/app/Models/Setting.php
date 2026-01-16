<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'setting_key',
        'setting_value',
        'setting_type',
        'setting_group',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'setting_value' => 'string',
    ];

    /**
     * Get setting value with proper type casting.
     */
    public function getValue()
    {
        return match($this->setting_type) {
            'boolean' => filter_var($this->setting_value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $this->setting_value,
            'float' => (float) $this->setting_value,
            'array', 'json' => json_decode($this->setting_value, true),
            default => $this->setting_value,
        };
    }

    /**
     * Set setting value with proper type handling.
     */
    public function setValue($value)
    {
        $this->setting_value = match($this->setting_type) {
            'array', 'json' => json_encode($value),
            'boolean' => $value ? '1' : '0',
            default => (string) $value,
        };
        $this->save();
    }

    /**
     * Get setting by key.
     */
    public static function get($key, $default = null)
    {
        $setting = static::where('setting_key', $key)->first();
        return $setting ? $setting->getValue() : $default;
    }

    /**
     * Set setting by key.
     */
    public static function set($key, $value, $type = 'string')
    {
        $setting = static::firstOrCreate(
            ['setting_key' => $key],
            ['setting_type' => $type]
        );
        $setting->setValue($value);
        return $setting;
    }

    /**
     * Get all settings as key-value array.
     */
    public static function getAllSettings()
    {
        return static::all()->mapWithKeys(function ($setting) {
            return [$setting->setting_key => $setting->getValue()];
        })->toArray();
    }

    /**
     * Get settings by group.
     */
    public static function getByGroup($group)
    {
        return static::where('setting_group', $group)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->setting_key => $setting->getValue()];
            })->toArray();
    }
}
