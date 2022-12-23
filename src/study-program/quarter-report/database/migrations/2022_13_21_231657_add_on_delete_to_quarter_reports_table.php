<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOnDeleteToQuarterReportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('study-program.QuarterReportDetails', function (Blueprint $table) {
            $table->dropForeign('study_program_quarterreportdetails_quarterreportid_foreign');
            $table->foreign('QuarterReportId')->references('Id')->on('study-program.QuarterReports')->onDelete('cascade');
        });

        Schema::table('study-program.QuarterReportDetailSubjects', function (Blueprint $table) {
            $table->dropForeign('study_program_quarterreportdetailsubjects_quarterreportdetailid');
            $table->foreign('QuarterReportDetailId')->references('Id')->on('study-program.QuarterReportDetails')->onDelete('cascade');
        });

        Schema::table('study-program.QuarterReportDetailSubjectChildrens', function (Blueprint $table) {
            $table->dropForeign('study_program_quarterreportdetailsubjectchildrens_quarterreport');
            $table->foreign('QuarterReportDetailSubjectId')->references('Id')->on('study-program.QuarterReportDetailSubjects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
