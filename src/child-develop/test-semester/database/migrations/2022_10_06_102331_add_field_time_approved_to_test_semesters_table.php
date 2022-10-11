<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldTimeApprovedToTestSemestersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TestSemesters', function (Blueprint $table) {
            $table->dateTime('TimeApproved')->nullable();
            $table->dateTime('TimePendingApproved')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TestSemesters', function (Blueprint $table) {
            $table->dropColumn(['TimePendingApproved', 'TimeApproved']);
        });
    }
}
