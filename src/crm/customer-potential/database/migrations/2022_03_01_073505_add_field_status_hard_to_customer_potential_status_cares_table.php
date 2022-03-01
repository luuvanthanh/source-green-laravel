<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldStatusHardToCustomerPotentialStatusCaresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customer_potential_status_cares', function (Blueprint $table) {
            $table->boolean('status_hard')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customer_potential_status_cares', function (Blueprint $table) {
            $table->dropColumn('status_hard');
        });
    }
}
