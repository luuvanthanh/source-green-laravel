<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCameraVideoWallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('camera_video_wall', function (Blueprint $table) {
            $table->uuid('camera_id');
            $table->foreign('camera_id')->references('id')->on('cameras')->onDelete('cascade');
            $table->uuid('video_wall_id');
            $table->foreign('video_wall_id')->references('id')->on('video_walls')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('camera_video_wall');
    }
}
