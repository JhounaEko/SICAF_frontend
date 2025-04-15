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
        Schema::create('items.notes', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('purchase_order', 15);
            $table->integer('note_number')->default(0);
            $table->string('payment_voucher', 15);
            $table->text('observations')->nullable();
            $table->integer('total_quantity');
            $table->decimal('total_amount', 10, 2);
            $table->boolean('is_donation')->default(0);
            $table->boolean('is_order_account')->default(0);
            $table->string('supplier', 100);
            $table->string('supplier_phone_number', 15)->nullable();
            $table->string('source', 15);
            $table->boolean('is_documented');
            $table->foreignId('office_id')->nullable()->constrained('users.offices')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('income_note_id')->nullable()->constrained('items.income_notes')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('note_type_id')->nullable()->constrained('items.note_types')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('requesting_office_id')->nullable()->constrained('users.offices')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.notes');
    }
};
