<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldTimeToQuarterReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('study-program.QuarterReports', function (Blueprint $table) {
            $table->dropColumn(['ReportTime', 'ConfirmationTime']);
            $table->timestamp('ReportTime')->nullable();
            $table->timestamp('ConfirmationTime')->nullable();
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
        });
    }
}
