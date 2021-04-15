<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScheduleRepeatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ScheduleRepeats', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('ScheduleId', 36);
            $table->foreign('ScheduleId')->references('id')->on('Schedules')->onDelete('cascade');
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
        Schema::dropIfExists('ScheduleRepeats');
    }
}
