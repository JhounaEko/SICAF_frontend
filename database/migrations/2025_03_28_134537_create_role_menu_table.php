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
        Schema::create('role_menu', function (Blueprint $table) {
            $table->unsignedInteger('role_id'); // Asegúrate de que el tipo coincida con el ID de tu tabla roles
            $table->unsignedBigInteger('menu_id'); // Asegúrate de que el tipo coincida con el ID de tu tabla menus
            $table->primary(['role_id', 'menu_id']); // Clave primaria compuesta

            $table->foreign('role_id')
                  ->references('id')
                  ->on('roles')
                  ->onDelete('cascade'); // Si se elimina un rol, se eliminan sus relaciones con menús

            $table->foreign('menu_id')
                  ->references('id')
                  ->on('menus')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_menu');
    }
};
