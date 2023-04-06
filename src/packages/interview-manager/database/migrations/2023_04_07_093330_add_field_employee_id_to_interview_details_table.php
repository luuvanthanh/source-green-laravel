<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldEmployeeIdToInterviewDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('InterviewDetails', function (Blueprint $table) {
            $table->uuid('EmployeeId')->nullable();
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('cascade');
            $table->string('Status')->nullable();
            $table->string('AverageScoreAsAssessedByStaff')->nullable();
            $table->uuid('PointEvaluationId')->nullable();
            $table->foreign('PointEvaluationId')->references('Id')->on('PointEvaluations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('InterviewDetails', function (Blueprint $table) {
            $table->dropColumn('EmployeeId');
            $table->dropColumn('Status');
            $table->dropColumn('AverageScoreAsAssessedByStaff');
            $table->dropColumn('PointEvaluationId');
        });
    }
}
