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
        Schema::create('items.movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('note_id')->nullable()->constrained('items.notes')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('item_id')->nullable()->constrained('items.items')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('movement_type', 15)->nullable();
            $table->string('description', 50)->nullable();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->string('v_serial_number')->nullable();
            $table->string('movement_serial_number')->nullable();
            $table->foreignId('from_item_id')->nullable()->constrained('items.items')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('to_item_id')->nullable()->constrained('items.items')->cascadeOnUpdate()->cascadeOnDelete();
            $table->integer('useful_months')->nullable();
            $table->integer('active_accounting_group_code')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.movements');
    }
};
