<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateListConfigTeamplateEmailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('list_config_teamplate_email', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('system_config_id');
            $table->foreign('system_config_id')->references('id')->on('system_configs')->onDelete('cascade');
            $table->string('name');
            $table->string('code');
            $table->boolean('is_on')->default(false);
            $table->string('title')->nullable();
            $table->mediumText('content')->nullable();
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
        Schema::dropIfExists('list_config_teamplate_email');
    }
}
