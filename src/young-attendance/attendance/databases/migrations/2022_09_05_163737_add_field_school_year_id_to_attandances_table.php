<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldSchoolYearIdToAttandancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Attendances', function (Blueprint $table) {
            $table->uuid('SchoolYearId')->nullable();
        });

        Schema::table('AttendanceLogs', function (Blueprint $table) {
            $table->uuid('SchoolYearId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Attendances', function (Blueprint $table) {
            $table->dropColumn('SchoolYearId');
        });

        Schema::table('AttendanceLogs', function (Blueprint $table) {
            $table->dropColumn('SchoolYearId');
        });
    }
}
