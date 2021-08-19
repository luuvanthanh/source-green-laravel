<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldBasicSalaryToLabourContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('LabourContracts', function (Blueprint $table) {
            $table->float('BasicSalary')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('LabourContracts', function (Blueprint $table) {
            $table->dropColumn('BasicSalary');
        });
    }
}
