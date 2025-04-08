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
        // Schema::table('permissions', function (Blueprint $table) {
        //     $table->unsignedBigInteger('state_id')->default(1)->after('guard_name');
        //     $table->foreign('state_id')->references('id')->on('states')->cascadeOnUpdate()->cascadeOnDelete();
        // });
        Schema::table('users', function (Blueprint $table) {
            // $table->string('identity_card', 15)->unique()->default('')->after('phone_number');
            // $table->string('identity_card', 15)->default('')->after('phone_number');
            // $table->unique('identity_card');
            // $table->string('issued_by', 4)->default('')->after('identity_card');
            $table->unsignedInteger('password_change_count')->default(3);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('permissions', function (Blueprint $table) {
        //     $table->dropForeign(['state_id']);
        //     $table->dropColumn('state_id');
        // });
        Schema::table('users', function (Blueprint $table) {
            //     $table->dropColumn('identity_card');
            $table->dropColumn('password_change_count');
            // $table->dropUnique('users_identity_card_unique');
            //     $table->dropColumn('issued_by');
        });
    }
};
