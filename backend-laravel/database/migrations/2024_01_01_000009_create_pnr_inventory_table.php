<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pnr_inventory', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('agent_id');
            $table->string('pnr_code');
            $table->string('airline_name');
            $table->string('airline_code', 10)->nullable();
            $table->string('flight_number', 20);
            $table->string('from_city');
            $table->string('from_city_code', 10);
            $table->string('to_city');
            $table->string('to_city_code', 10);
            $table->date('departure_date');
            $table->time('departure_time');
            $table->date('arrival_date');
            $table->time('arrival_time');
            $table->integer('total_seats');
            $table->integer('sold_seats')->default(0);
            $table->integer('remaining_seats');
            $table->decimal('buying_price_per_seat', 10, 2);
            $table->decimal('total_buying_price', 10, 2);
            $table->datetime('expiry_datetime');
            $table->string('supplier_name')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['active', 'sold_out', 'expired'])->default('active');
            $table->enum('entry_type', ['search', 'manual'])->default('manual');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('agent_id')->references('id')->on('users')->onDelete('cascade');

            $table->index('agent_id');
            $table->index('pnr_code');
            $table->index('status');
            $table->index('departure_date');
            $table->index('expiry_datetime');
            $table->index(['from_city_code', 'to_city_code']);
            
            // Unique constraint: PNR + departure date
            $table->unique(['pnr_code', 'departure_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pnr_inventory');
    }
};
