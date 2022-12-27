<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConfigReceiveNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('config_receive_notifications', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('user_id');
            $table->uuid('event_type_id');
            $table->boolean('is_use')->default(true);
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
        Schema::dropIfExists('config_receive_notifications');
    }
}
