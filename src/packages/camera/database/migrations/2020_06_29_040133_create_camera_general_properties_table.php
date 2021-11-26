<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCameraGeneralPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('camera_general_properties', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('camera_id');
            $table->foreign('camera_id')->references('id')->on('cameras')->onDelete('cascade');
            $table->string('device_name')->nullable(false);
            $table->string('device_number')->nullable();
            $table->string('device_model')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('firmware_ver')->nullable();
            $table->string('ip')->nullable();
            $table->integer('port')->nullable();
            $table->string('user_name')->nullable();
            $table->string('password')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('camera_general_properties');
    }
}
