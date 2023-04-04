<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInterviewerEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('InterviewerEmployees', function (Blueprint $table) {
            $table->uuid('InterviewerId');
            $table->foreign('InterviewerId')->references('Id')->on('Interviewers');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('InterviewerEmployees');
    }
}
