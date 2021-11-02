<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldSalaryHoursToPayrollDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('PayrollDetails', function (Blueprint $table) {
            $table->bigInteger('SalaryByHour')->nullable();
            $table->integer('OtWeekday')->nullable();
            $table->integer('OtWeekend')->nullable();
            $table->integer('OtHoliday')->nullable();
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
            $table->dropColumn('SalaryByHour');
            $table->dropColumn('OtWeekday');
            $table->dropColumn('OtWeekend');
            $table->dropColumn('OtHoliday');
        });
    }
}
