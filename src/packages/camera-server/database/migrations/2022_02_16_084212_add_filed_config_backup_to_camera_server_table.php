<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFiledConfigBackupToCameraServerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('camera_servers', function (Blueprint $table) {
            $table->integer('backup_video_day_passed')->default(15);
            $table->integer('clip_video_day_passed')->default(15);
            $table->integer('loggings_day_passed')->default(15);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('camera_servers', function (Blueprint $table) {
            $table->dropColumn('backup_video_day_passed');
            $table->dropColumn('clip_video_day_passed');
            $table->dropColumn('loggings_day_passed');
        });
    }
}
