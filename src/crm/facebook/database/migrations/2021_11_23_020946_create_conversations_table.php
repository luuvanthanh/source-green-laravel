<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConversationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('conversation_id_facebook')->nullable();
            $table->uuid('page_id');
            $table->uuid('user_facebook_info_id');
            $table->string('avatar')->nullable();
            $table->string('snippet')->nullable();
            $table->string('time')->nullable();
            $table->foreign('page_id')->references('id')->on('pages');
            $table->foreign('user_facebook_info_id')->references('id')->on('user_facebook_infos');
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
        Schema::dropIfExists('conversations');
    }
}
