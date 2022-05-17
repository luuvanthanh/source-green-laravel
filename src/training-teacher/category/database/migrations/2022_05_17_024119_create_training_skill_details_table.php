<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingSkillDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate-teacher.TrainingSkillDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Skill');
            $table->string('Content')->nullable();
            $table->uuid('TrainingFormId')->nullable();
            $table->integer('TrainingHuman');
            $table->date('TheoryTrainingTime')->nullable();
            $table->string('TheoreticalTrainingGoal')->nullable();
            $table->date('PracticalTrainingTime')->nullable();
            $table->string('PracticalTrainingGoal')->nullable();
            $table->boolean('IsUse')->default(false);
            $table->uuid('TrainingSkillId');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
            $table->foreign('TrainingSkillId')->references('Id')->on('evaluate-teacher.TrainingSkills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate-teacher.TrainingSkillDetails');
    }
}
