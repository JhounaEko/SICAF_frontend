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
        Schema::create('accounting.enterprises', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->nullable();
            $table->string('initials', 10)->nullable();
            $table->string('branch_name', 15)->nullable();
            $table->text('address')->nullable();
            $table->string('country', 25);
            $table->string('phone_number', 15)->nullable();
            $table->string('other_phone_number', 15)->nullable();
            $table->string('email')->nullable();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('enterprise_rubric_id')->nullable()->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('representative_name', 50)->nullable();
            $table->string('contact_name', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting.enterprises');
    }
};
