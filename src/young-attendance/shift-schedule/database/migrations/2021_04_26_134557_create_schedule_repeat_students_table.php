<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScheduleRepeatStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ScheduleRepeatStudents', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ScheduleId');
            $table->foreign('ScheduleId')->references('Id')->on('ScheduleStudents')->onDelete('cascade');
            $table->string('RepeatBy');
            $table->integer('Count');
            $table->integer('Interval')->nullable();
            $table->string('ByWeekDay')->nullable();
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
        Schema::dropIfExists('ScheduleRepeatStudents');
    }
}
