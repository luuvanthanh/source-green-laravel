<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCameraNetworkPropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('camera_network_properties', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('camera_id');
            $table->foreign('camera_id')->references('id')->on('cameras')->onDelete('cascade');
            $table->string('ipv4_addr')->nullable();
            $table->string('ipv4_subnetmask')->nullable();
            $table->string('ipv4_gateway')->nullable();
            $table->string('ipv6_addr')->nullable();
            $table->string('ipv6_subnetmask')->nullable();
            $table->string('ipv6_gateway')->nullable();
            $table->string('dns_server_primary')->nullable();
            $table->string('dns_server_secondary')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('camera_network_properties');
    }
}
