<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataMarketingProgram extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_marketing_program', function (Blueprint $table) {
            $table->uuid('data_marketing_id');
            $table->uuid('marketing_program_id');
            $table->foreign('data_marketing_id')->references('id')->on('data_marketings');
            $table->foreign('marketing_program_id')->references('id')->on('marketing_programs');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_marketing_program');
    }
}
