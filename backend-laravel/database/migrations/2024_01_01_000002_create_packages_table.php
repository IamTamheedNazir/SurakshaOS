<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('vendor_id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('duration'); // in days
            $table->string('destination');
            $table->string('departure_city')->nullable();
            $table->string('accommodation_type', 100)->nullable();
            $table->string('transportation_type', 100)->nullable();
            $table->string('meal_plan', 100)->nullable();
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->json('itinerary')->nullable();
            $table->text('terms_conditions')->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->json('images')->nullable();
            $table->string('featured_image')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->boolean('featured')->default(false);
            $table->integer('max_travelers')->nullable();
            $table->integer('min_travelers')->nullable();
            $table->date('available_from')->nullable();
            $table->date('available_to')->nullable();
            $table->integer('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('vendor_id')->references('id')->on('users')->onDelete('cascade');

            // Indexes
            $table->index('vendor_id');
            $table->index('status');
            $table->index('featured');
            $table->index('destination');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
