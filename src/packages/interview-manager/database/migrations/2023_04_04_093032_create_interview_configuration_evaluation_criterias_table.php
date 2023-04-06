<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInterviewConfigurationEvaluationCriteriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('InterviewConfigurationEvaluationCriterias', function (Blueprint $table) {
            $table->uuid('InterviewConfigurationId');
            $table->foreign('InterviewConfigurationId')->references('Id')->on('InterviewConfigurations')->onDelete('cascade');
            $table->uuid('EvaluationCriteriaId');
            $table->foreign('EvaluationCriteriaId')->references('Id')->on('EvaluationCriteriass')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('InterviewConfigurationEvaluationCriterias');
    }
}
