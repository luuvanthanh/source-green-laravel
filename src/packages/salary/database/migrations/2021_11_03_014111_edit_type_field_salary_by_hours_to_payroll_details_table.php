<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditTypeFieldSalaryByHoursToPayrollDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"PayrollDetails"', function (Blueprint $table) {
            $table->float('"SalaryByHour"', 12, 2)->nullable()->change();
            $table->float('"OtWeekday"')->nullable()->change();
            $table->float('"OtWeekend"')->nullable()->change();
            $table->float('"OtHoliday"')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"PayrollDetails"', function (Blueprint $table) {
            //
        });
    }
}
