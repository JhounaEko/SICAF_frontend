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
        Schema::create('items.plates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->nullable()->constrained('items.items')->cascadeOnUpdate()->cascadeOnDelete();
            $table->text('description');
            $table->string('serie', 25);
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.plates');
    }
};
