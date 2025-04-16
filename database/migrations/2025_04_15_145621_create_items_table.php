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
        Schema::create('items.items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_group_id')->nullable()->constrained('items.item_groups')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('description', 15)->nullable();
            $table->string('item_grouping', 25)->nullable();
            $table->bigInteger('movement_id');
            $table->foreignId('transfer_movement_id')->nullable()->constrained('items.transfer_movements')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('item_description', 100)->nullable();
            $table->string('capacity', 25)->nullable();
            $table->string('unit', 25)->nullable();
            $table->string('brand', 25)->nullable();
            $table->string('model', 25)->nullable();
            $table->string('serial_number', 50)->nullable();
            $table->foreignId('funding_source_id')->nullable()->constrained('items.funding_sources')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('funding_organization_id')->nullable()->constrained('items.funding_organizations')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('budget_rubric_id')->nullable()->constrained('items.budget_rubrics')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('office_id')->nullable()->constrained('users.offices')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('person_id')->nullable()->constrained('users.persons')->cascadeOnUpdate()->cascadeOnDelete();
            $table->text('observations')->nullable();
            $table->date('purchase_date')->nullable();
            $table->decimal('insurance_value', 15, 2)->nullable();
            $table->boolean('needs_calibration')->default(0);
            $table->boolean('is_internal')->default(0);
            $table->boolean('is_discharged')->default(0);
            $table->boolean('is_active')->default(0);
            $table->decimal('original_value', 15, 2)->nullable();
            $table->integer('useful_months')->nullable();
            $table->date('validated_at')->nullable();
            $table->string('rta', 15)->nullable();
            $table->foreignId('note_id')->nullable()->constrained('items.notes')->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('discharged_at')->nullable();
            $table->foreignId('motive_id')->nullable()->constrained('items.motives')->cascadeOnUpdate()->cascadeOnDelete();
            $table->boolean('has_insurance')->default(0);
            $table->boolean('id_donation')->default(0);
            $table->boolean('is_order_account')->default(0);
            $table->string('source', 50);
            $table->boolean('is_documented')->default(0);
            $table->bigInteger('recoded_by')->nullable();
            $table->date('recoded_at')->nullable();
            $table->bigInteger('assigned_by')->nullable();
            $table->date('assigned_at')->nullable();
            $table->boolean('is_found')->default(0);
            $table->integer('inventory_number')->nullable();
            $table->text('inventory_notes')->nullable();
            $table->integer('inventory_form_number')->nullable();
            $table->string('adq_concept', 15)->nullable();
            $table->string('movement_type', 15)->nullable();
            $table->integer('plate_code')->nullable();
            $table->string('rubric_type', 15)->nullable();
            $table->foreignId('summary_id')->nullable()->constrained('items.summaries')->cascadeOnUpdate()->cascadeOnDelete();
            $table->integer('active_accounting_group_code')->nullable();
            $table->foreignId('state_id')->default(1)->constrained('public.states')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items.items');
    }
};
