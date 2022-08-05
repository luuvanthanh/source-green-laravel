<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluateStepEvaluateTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate_teacher.EvaluateStepEvaluateType', function (Blueprint $table) {
            $table->uuid('EvaluateStepId');
            $table->uuid('EvaluateTypeId');
            $table->foreign('EvaluateStepId')->references('Id')->on('evaluate_teacher.EvaluateSteps')->onDelete('cascade');
            $table->foreign('EvaluateTypeId')->references('Id')->on('evaluate_teacher.EvaluateTypes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate_teacher.EvaluateStepEvaluateType');
    }
}
