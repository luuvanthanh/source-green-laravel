<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProbationaryContractParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('probationary_contract_parameter_value', function (Blueprint $table) {
            $table->integer('value');
            $table->string('probationary_contract_id', 36);
            $table->string('parameter_value_id', 36);
            $table->foreign('probationary_contract_id')->references('id')->on('probationary_contracts');
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
        Schema::dropIfExists('probationary_contract_parameter_value');
    }
}
