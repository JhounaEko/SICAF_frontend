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
        Schema::create('accounting.historic_increments', function (Blueprint $table) {
            $table->id();
            $table->integer('item_id')->nullable();
            $table->date('date')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(0);
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounting.historic_increments');
    }
};
