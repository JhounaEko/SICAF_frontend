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
        Schema::create('users.staff', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 30);
            $table->string('last_name', 30);
            $table->string('identity_card', 15)->unique();
            $table->string('issued_by', 4);
            $table->string('phone_number', 15);
            $table->string('office_phone_number', 15)->nullable();
            $table->string('other_phone_number', 15)->nullable();
            $table->string('email')->nullable();
            $table->foreignId('position_id')->nullable()->constrained('users.positions')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('office_location_id')->nullable()->constrained('users.office_location_id')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users.staff');
    }
};
