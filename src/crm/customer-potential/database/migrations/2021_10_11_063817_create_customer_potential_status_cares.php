<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerPotentialStatusCares extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_potential_status_cares', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('user_update_id')->nullable();
            $table->json('user_update_info')->nullable();
            $table->uuid('status_parent_potential_id');
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
        Schema::dropIfExists('customer_potential_status_cares');
    }
}
