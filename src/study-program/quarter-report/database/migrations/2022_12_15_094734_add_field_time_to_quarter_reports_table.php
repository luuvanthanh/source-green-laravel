<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldTimeToQuarterReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('study-program.QuarterReports', function (Blueprint $table) {
            $table->dateTime('ReportTime')->nullable();
            $table->dateTime('ConfirmationTime')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('study-program.QuarterReports', function (Blueprint $table) {
            $table->dropColumn(['ReportTime', 'ConfirmationTime']);
        });
    }
}
