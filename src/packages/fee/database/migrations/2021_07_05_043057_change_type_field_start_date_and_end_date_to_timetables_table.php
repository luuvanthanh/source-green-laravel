<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldStartDateAndEndDateToTimetablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.Timetables', function (Blueprint $table) {
            $table->dropColumn('StartDate');
            $table->dropColumn('EndDate');
        });

        Schema::table('fee.Timetables', function (Blueprint $table) {
            $table->date('StartDate');
            $table->date('EndDate');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.Timetables', function (Blueprint $table) {
            //
        });
    }
}
