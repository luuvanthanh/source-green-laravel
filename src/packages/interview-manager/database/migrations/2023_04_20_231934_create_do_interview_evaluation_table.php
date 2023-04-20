<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoInterviewEvaluationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DoInterviewEvaluations', function (Blueprint $table) {
            $table->uuid('DoInterviewId');
            $table->foreign('DoInterviewId')->references('Id')->on('DoInterviews')->onDelete('cascade');
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
        Schema::dropIfExists('DoInterviewEvaluations');
    }
}
