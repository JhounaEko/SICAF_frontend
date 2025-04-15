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
        Schema::create('items.documents', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('item_id');
            $table->integer('year')->nullable();
            $table->decimal('original_value', 10, 2)->nullable();
            $table->date('date');
            // $table->string('rta', )
            $table->integer('useful_months');
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.documents');
    }
};
