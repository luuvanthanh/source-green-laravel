<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldVmsUrlToCameraServersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('camera_servers', function (Blueprint $table) {
            $table->string('server_name')->nullable();
            $table->string('vms_url')->nullable();
            $table->string('ai_service_url')->nullable();
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
            $table->dropColumn('server_name');
            $table->dropColumn('vms_url');
            $table->dropColumn('ai_service_url');
        });
    }
}
