<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluateTypeDetailRatingLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate-teacher.EvaluateTypeDetailRatingLevels', function (Blueprint $table) {
            $table->uuid('EvaluateTypeDetailId');
            $table->foreign('EvaluateTypeDetailId')->references('Id')->on('evaluate-teacher.EvaluateTypeDetails')->onDelete('cascade');
            $table->uuid('RatingLevelId');
            $table->foreign('RatingLevelId')->references('Id')->on('evaluate-teacher.RatingLevels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate-teacher.EvaluateTypeDetailRatingLevels');
    }
}
