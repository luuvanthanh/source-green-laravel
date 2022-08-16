<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldFeeBusInPayrollDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('PayrollDetails', function (Blueprint $table) {
            $table->decimal('BusAllowance', 16, 2)->nullable();
            $table->decimal('TotalBusRegistration', 16, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('PayrollDetails', function (Blueprint $table) {
            $table->dropColumn('BusAllowance','TotalBusRegistration');
        });
    }
}
