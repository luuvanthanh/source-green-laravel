<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeasonalContractParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('SeasonalContractParameterValue', function (Blueprint $table) {
            $table->integer('Value');
            $table->uuid('SeasonalContractId');
            $table->uuid('ParameterValueId');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('SeasonalContractParameterValue');
    }
}
