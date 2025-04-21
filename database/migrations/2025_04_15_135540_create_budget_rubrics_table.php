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
        Schema::create('items.budget_rubrics', function (Blueprint $table) {
            $table->id();
            $table->string('rubric', 10);
            $table->string('description', 80);
            $table->integer('lifespan')->nullable(); 
            $table->boolean('is_depreciated')->default(0);
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.budget_rubrics');
    }
};
