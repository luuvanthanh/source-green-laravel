<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnToCameraVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('camera_video_properties', function (Blueprint $table) {
            $table->string('device_number')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('firmware_ver')->nullable();
            $table->string('rtsp_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('camera_video_properties', function (Blueprint $table) {
            $table->dropColumn('device_number');
            $table->dropColumn('model');
            $table->dropColumn('serial_number');
            $table->dropColumn('firmware_ver');
        });
    }
}
