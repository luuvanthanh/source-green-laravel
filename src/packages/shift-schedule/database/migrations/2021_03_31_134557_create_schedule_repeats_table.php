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
        Schema::create('schedule_repeats', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('schedule_id', 36)->unique();
            $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('cascade');
            $table->string('repeat_by');
            $table->integer('count');
            $table->integer('interval')->nullable();
            $table->string('by_week_day')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedule_repeats');
    }
}
