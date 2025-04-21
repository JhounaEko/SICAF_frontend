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
        Schema::create('items.income_notes', function (Blueprint $table) {
            $table->id();
            $table->string('note', 20)->nullable();
            $table->string('payment_receipt', 25);
            $table->string('expense_receipt', 25)->nullable();
            $table->string('voucher_number', 20);
            $table->decimal('dfm_amount', 10, 2)->nullable();
            $table->date('dfm_date');
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.income_notes');
    }
};
