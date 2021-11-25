<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCameraPtzPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('camera_ptz_properties', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('camera_id');
            $table->foreign('camera_id')->references('id')->on('cameras')->onDelete('cascade');
            $table->string('zoom_enabled')->default(0)->nullable(false);
            $table->string('pan_enabled')->default(0)->nullable(false);
            $table->string('tilt_enabled')->default(0)->nullable(false);
            $table->string('zoom_val')->default(1)->nullable(false);
            $table->float('pan_val')->default('0.0')->nullable(false);
            $table->float('tilt_val')->default('0.0')->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('camera_ptz_properties');
    }
}
