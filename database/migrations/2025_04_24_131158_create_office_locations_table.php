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
        Schema::create('users.office_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('office_id')->nullable()->constrained('users.offices')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('place_id')->nullable()->constrained('users.places')->cascadeOnUpdate()->cascadeOnDelete();
            $table->decimal('latitude', 10, 7)->nullable(); 
            $table->decimal('longitude', 10, 7)->nullable();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_locations');
    }
};
