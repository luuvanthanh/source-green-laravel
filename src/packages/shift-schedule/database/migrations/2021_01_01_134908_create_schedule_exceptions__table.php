<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScheduleExceptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ScheduleExceptions', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('ScheduleId', 36);
            $table->foreign('ScheduleId')->references('id')->on('Schedules')->onDelete('cascade');
            $table->date('Date');
            $table->string('ShiftId', 36);
            $table->foreign('ShiftId')->references('id')->on('Shifts')->onDelete('cascade');
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
        Schema::dropIfExists('ScheduleExceptions');
    }
}
