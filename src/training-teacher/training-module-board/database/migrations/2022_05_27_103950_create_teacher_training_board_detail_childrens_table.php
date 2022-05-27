<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeacherTrainingBoardDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate-teacher.TeacherTrainingBoardDetailChildrens', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('TrainingModuleDetailId');
            $table->date('Date');
            $table->uuid('TeacherTrainingBoardDetailId');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
            $table->foreign('TeacherTrainingBoardDetailId')->references('Id')->on('evaluate-teacher.TeacherTrainingBoardDetails')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate-teacher.TeacherTrainingBoardDetailChildrens');
    }
}
