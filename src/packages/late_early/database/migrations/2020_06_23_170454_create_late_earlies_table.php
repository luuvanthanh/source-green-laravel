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
        Schema::create('late_earlies', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('time_config_type')->nullable();
            $table->time('time')->nullable();
            $table->dateTime('date')->nullable();
            $table->string('user_id')->nullable();
            $table->string('shift_code')->nullable();
            $table->string('time_shift')->nullable();
            $table->string('time_slot')->nullable();
            $table->time('time_violation')->nullable();
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
        Schema::dropIfExists('late_earlies');
    }
}
