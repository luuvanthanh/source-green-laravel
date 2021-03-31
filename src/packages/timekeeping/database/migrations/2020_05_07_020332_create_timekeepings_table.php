<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTimekeepingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('timekeepings', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->bigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('SET NULL');
            $table->string('device_id', 36)->nullable();
            $table->foreign('device_id')->references('id')->on('fingerprint_timekeepers');
            $table->string('type');
            $table->text('tracking_type');
            $table->dateTime('attended_at');
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
        Schema::dropIfExists('timekeepings');
    }
}
