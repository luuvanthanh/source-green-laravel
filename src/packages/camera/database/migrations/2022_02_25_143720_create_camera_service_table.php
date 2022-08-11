<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCameraServiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('camera_service', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('camera_id');
            $table->foreign('camera_id')->references('id')->on('cameras')->onDelete('cascade');
            $table->uuid('ai_service_id');
            $table->foreign('ai_service_id')->references('id')->on('ai_services')->onDelete('cascade');
            $table->boolean('is_on')->default(false);
            $table->json('coordinates')->nullable();
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
        Schema::dropIfExists('camera_service');
    }
}
