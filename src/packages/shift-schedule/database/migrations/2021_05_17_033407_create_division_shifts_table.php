<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDivisionShiftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DivisionShifts', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('EmployeeCreateId');
            $table->foreign('EmployeeCreateId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions')->onDelete('cascade');
            $table->uuid('ShiftId');
            $table->foreign('ShiftId')->references('Id')->on('Shifts')->onDelete('cascade');
            $table->date('StartDate');
            $table->date('EndDate');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('DivisionShifts');
    }
}
