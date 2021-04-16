<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLateEarliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('LateEarlies', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('TimeConfigType')->nullable();
            $table->time('Time')->nullable();
            $table->dateTime('Date')->nullable();
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->string('ShiftCode')->nullable();
            $table->string('TimeShift')->nullable();
            $table->string('TimeSlot')->nullable();
            $table->time('TimeViolation')->nullable();
            $table->string('Status')->nullable();
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
        Schema::dropIfExists('LateEarlies');
    }
}
