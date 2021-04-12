<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLabourContractParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('labour_contract_parameter_value', function (Blueprint $table) {
            $table->integer('value');
            $table->string('labour_contract_id', 36);
            $table->string('parameter_value_id', 36);
            $table->foreign('labour_contract_id')->references('id')->on('labour_contracts');
            $table->foreign('parameter_value_id')->references('id')->on('parameter_values');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('labour_contract_parameter_value');
    }
}
