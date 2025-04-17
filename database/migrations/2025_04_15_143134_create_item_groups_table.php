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
        Schema::create('items.item_groups', function (Blueprint $table) {
            $table->id();
            $table->string('item_description', 15);
            $table->integer('item_group_type_id');
            $table->string('alphanumeric_code')->nullable();
            $table->string('item_group_description', 50);
            $table->string('material', 15)->nullable();
            $table->string('type', 30)->nullable();
            $table->boolean('is_intangible')->default(0);
            $table->integer('useful_months')->nullable();
            $table->foreignId('budget_rubric_id')->nullable()->constrained('items.budget_rubrics')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.item_groups');
    }
};
