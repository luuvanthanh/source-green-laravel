<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeeTypeTeachersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('EmployeeTypeTeacher', function (Blueprint $table) {
            $table->uuid('EmployeeId');
            $table->uuid('TypeTeacherId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('EmployeeTypeTeacher');
    }
}
