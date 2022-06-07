<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingScheduleDetailEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate-teacher.TrainingScheduleDetailEmployees', function (Blueprint $table) {
            $table->uuid('TrainingScheduleDetailId');
            $table->uuid('EmployeeId'); // Only employee with type teacher
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
        Schema::dropIfExists('evaluate-teacher.TrainingScheduleDetailEmployees');
    }
}
