<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('setting_key')->unique();
            $table->text('setting_value')->nullable();
            $table->string('setting_type')->default('string'); // string, integer, boolean, json, array
            $table->string('setting_group')->nullable(); // general, payment, email, etc.
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('setting_key');
            $table->index('setting_group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
