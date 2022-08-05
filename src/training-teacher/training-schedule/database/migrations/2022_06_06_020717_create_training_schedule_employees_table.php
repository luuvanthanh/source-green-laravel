<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingScheduleEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate_teacher.TrainingScheduleEmployees', function (Blueprint $table) {
            $table->uuid('TrainingScheduleId');
            $table->uuid('EmployeeId'); // Only employee with type teacher
            $table->foreign('TrainingScheduleId')->references('Id')->on('evaluate_teacher.TrainingSchedules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate_teacher.TrainingScheduleEmployees');
    }
}
