<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeFieldTotalMonthToSchoolYearsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.SchoolYears', function (Blueprint $table) {
            $table->dropColumn('TotalMonth');
        });

        Schema::table('fee.SchoolYears', function (Blueprint $table) {
            $table->float('TotalMonth')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.SchoolYears', function (Blueprint $table) {
            //
        });
    }
}
