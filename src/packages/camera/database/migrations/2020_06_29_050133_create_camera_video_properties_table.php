<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCameraVideoPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('camera_video_properties', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('camera_id');
            $table->foreign('camera_id')->references('id')->on('cameras')->onDelete('cascade');
            $table->string('rtsp_url')->nullable(false);
            $table->string('resolution')->default('1280x960')->nullable(false);
            $table->string('video_encoding')->default('H.264')->nullable(false);
            $table->integer('frame_rate')->default(15)->nullable(false)->comment('fps');
            $table->integer('bit_rate')->default(8192)->nullable(false)->comment('Kbps');
            $table->smallInteger('recording_enabled')->default(0)->comment('1: active, 0: deactive');
            $table->smallInteger('streaming_enabled')->default(0)->comment('1: active, 0: deactive');
            $table->string('stream_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('camera_video_properties');
    }
}
