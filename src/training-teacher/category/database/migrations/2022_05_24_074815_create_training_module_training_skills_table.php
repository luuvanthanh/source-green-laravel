<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingModuleTrainingSkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate_teacher.TrainingModuleTrainingSkills', function (Blueprint $table) {
            $table->uuid('TrainingModuleId');
            $table->uuid('TrainingSkillId');
            $table->foreign('TrainingModuleId')->references('Id')->on('evaluate_teacher.TrainingModules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate_teacher.TrainingModuleTrainingSkills');
    }
}
