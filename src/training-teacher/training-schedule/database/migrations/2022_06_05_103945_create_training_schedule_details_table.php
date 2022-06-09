<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingScheduleDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate-teacher.TrainingScheduleDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->date('DateTraining');
            $table->time('StartTime');
            $table->time('EndTime')->nullable();
            $table->string('Location')->nullable();
            $table->uuid('TrainingScheduleId');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
            $table->foreign('TrainingScheduleId')->references('Id')->on('evaluate-teacher.TrainingSchedules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate-teacher.TrainingScheduleDetails');
    }
}
