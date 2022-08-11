<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeamplateEmailVariableTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teamplate_email_variable', function (Blueprint $table) {
            $table->uuid('teamplate_email_id');
            $table->foreign('teamplate_email_id')->references('id')->on('list_config_teamplate_email')->onDelete('cascade');
            $table->uuid('variable_id');
            $table->foreign('variable_id')->references('id')->on('email_variable_definitions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('teamplate_email_variable');
    }
}
