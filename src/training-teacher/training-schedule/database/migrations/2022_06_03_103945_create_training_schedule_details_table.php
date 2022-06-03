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
            $table->string('TrainingModuleId');
            $table->uuid('TeacherTrainingBoardId');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
            $table->foreign('TeacherTrainingBoardId')->references('Id')->on('evaluate-teacher.TeacherTrainingBoards')->onDelete('cascade');
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
