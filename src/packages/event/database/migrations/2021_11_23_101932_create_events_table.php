<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('event_type_id');
            $table->uuid('tourist_destination_id');
            $table->uuid('camera_id')->nullable();
            $table->integer('warning_level')->default(0);
            $table->integer('status')->default(0);
            $table->boolean('is_follow')->default(false);
            $table->datetime('time');
            $table->uuid('tour_guide_id')->nullable();
            $table->string('classify')->nullable();
            $table->integer('status_detail')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
