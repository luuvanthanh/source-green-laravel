<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingScheduleDetailTrainersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate-teacher.TrainingScheduleDetailTrainers', function (Blueprint $table) {
            $table->uuid('TrainingScheduleDetailId');
            $table->uuid('TrainerId'); // Only employee with type teacher and N6
            $table->foreign('TrainingScheduleDetailId')->references('Id')->on('evaluate-teacher.TrainingScheduleDetails')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate-teacher.TrainingScheduleDetailTrainers');
    }
}
