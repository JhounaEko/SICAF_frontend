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
        Schema::create('accounting.historic_note_details', function (Blueprint $table) {
            $table->id();
            $table->integer('note_id')->nullable();
            $table->integer('income_note_id')->nullable();
            $table->string('payment_voucher', 15)->nullable();
            $table->string('expense_voucher', 15)->nullable();
            $table->string('voucher', 15)->nullable();
            $table->integer('fdm_amount')->nullable();
            $table->date('fdm_date')->nullable();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting.historic_note_details');
    }
};
