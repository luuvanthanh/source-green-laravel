<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToCameraServersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('camera_servers', function (Blueprint $table) {
            $table->string('uuid')->nullable();
            $table->string('root_path_bk')->nullable();
            $table->string('second_interval_bk')->nullable();
            $table->string('media_server_url')->nullable();
            $table->string('clip_root_path')->nullable();
            $table->string('log_root_path')->nullable();
            $table->string('log_level')->nullable();
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
            $table->dropColumn('uuid');
            $table->dropColumn('root_path_bk');
            $table->dropColumn('second_interval_bk');
            $table->dropColumn('media_server_url');
            $table->dropColumn('clip_root_path');
            $table->dropColumn('log_root_path');
            $table->dropColumn('log_level');
        });
    }
}
