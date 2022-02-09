<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldSchoolYearCrmIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.SchoolYears', function (Blueprint $table) {
            $table->uuid('SchoolYearCrmId')->nullable();
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
            $table->dropColumn('SchoolYearCrmId');
        });
    }
}
