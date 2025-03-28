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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent')->unsigned()->nullable();
            $table->string('label');
            $table->string('route')->nullable();
            $table->string('icon')->nullable();
            $table->smallInteger('level')->unsigned();
            $table->integer('order')->default(0);
            $table->foreignId('state_id')->default(1)->constrained('states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
