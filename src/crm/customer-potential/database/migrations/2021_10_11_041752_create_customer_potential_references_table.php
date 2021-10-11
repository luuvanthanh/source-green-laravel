<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerPotentialReferencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_potential_references', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('full_name');
            $table->date('birth_date')->nullable();
            $table->string('address')->nullable();
            $table->string('phone');
            $table->uuid('status_parent_potential_id')->nullable();
            $table->uuid('customer_potential_id');
            $table->foreign('customer_potential_id')->references('id')->on('customer_potentials')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customer_potential_references');
    }
}
