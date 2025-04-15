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
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_type', 15);
            $table->date('date');
            $table->foreignId('from_office_id')->nullable()->constrained('users.offices')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('from_person_id')->nullable()->constrained('users.persons')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('to_office_id')->nullable()->constrained('users.offices')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('to_person_id')->nullable()->constrained('users.persons')->cascadeOnUpdate()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};
