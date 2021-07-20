<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldSchoolDayToChangeParameterDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.ChangeParameterDetails', function (Blueprint $table) {
            $table->integer('SchoolDay')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.ChangeParameterDetails', function (Blueprint $table) {
            $table->dropColumn('SchoolDay');
        });
    }
}
