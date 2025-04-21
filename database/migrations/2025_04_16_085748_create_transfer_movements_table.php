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
        Schema::create('items.transfer_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transfer_id')->nullable()->constrained('items.transfers')->cascadeOnUpdate()->cascadeOnDelete();
            $table->bigInteger('item_id');
            $table->bigInteger('from_item_id');
            $table->bigInteger('to_item_id');
            $table->foreignId('motive_id')->nullable()->constrained('items.motives')->cascadeOnUpdate()->cascadeOnDelete();
            $table->smallInteger('transfer_movement_type');
            $table->foreignId('entry_note_detail_id')->nullable()->constrained('items.entry_note_details')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.transfer_movements');
    }
};
