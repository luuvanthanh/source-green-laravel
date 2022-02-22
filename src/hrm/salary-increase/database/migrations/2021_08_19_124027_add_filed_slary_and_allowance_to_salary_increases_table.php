<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFiledSlaryAndAllowanceToSalaryIncreasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('SalaryIncreases', function (Blueprint $table) {
            $table->float('TotalAllowance')->nullable();
            $table->float('BasicSalary')->nullable();
            $table->float('OldBasicSalary')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('SalaryIncreases', function (Blueprint $table) {
            $table->dropColumn('TotalAllowance');
            $table->dropColumn('BasicSalary');
            $table->dropColumn('OldBasicSalary');
        });
    }
}
