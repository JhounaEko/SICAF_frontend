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
        Schema::create('items.summaries', function (Blueprint $table) {
            $table->id();
            $table->string('rubric', 50)->nullable();
            $table->decimal('acquisition_cost', 15, 2);
            $table->decimal('accumulated_depreciation', 15, 2);
            $table->decimal('asset_cost', 15, 2);
            $table->decimal('current_cost', 15, 2);
            $table->decimal('annual_depreciation', 15, 2);
            $table->decimal('current_depreciation', 15, 2);
            $table->decimal('total_accumulated_depreciation', 15, 2);
            $table->decimal('net_value', 15, 2);
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.summaries');
    }
};
