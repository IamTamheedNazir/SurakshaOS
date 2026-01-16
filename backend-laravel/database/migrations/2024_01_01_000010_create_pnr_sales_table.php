<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pnr_sales', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pnr_inventory_id');
            $table->uuid('agent_id');
            $table->uuid('customer_id');
            $table->string('booking_reference')->unique();
            $table->integer('seats_sold');
            $table->decimal('selling_price_per_seat', 10, 2);
            $table->decimal('total_selling_price', 10, 2);
            $table->decimal('buying_price_per_seat', 10, 2);
            $table->decimal('total_buying_price', 10, 2);
            $table->decimal('profit', 10, 2);
            $table->enum('sale_channel', ['walk-in', 'website', 'makemytrip', 'easemytrip', 'corporate', 'sub-agent']);
            $table->enum('payment_status', ['paid', 'pending', 'partially_paid'])->default('pending');
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('pending_amount', 10, 2);
            $table->string('invoice_number')->unique();
            $table->string('voucher_path')->nullable();
            $table->boolean('voucher_sent_email')->default(false);
            $table->boolean('voucher_sent_whatsapp')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('pnr_inventory_id')->references('id')->on('pnr_inventory')->onDelete('cascade');
            $table->foreign('agent_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');

            $table->index('pnr_inventory_id');
            $table->index('agent_id');
            $table->index('customer_id');
            $table->index('booking_reference');
            $table->index('payment_status');
            $table->index('sale_channel');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pnr_sales');
    }
};
