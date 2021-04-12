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
            $table->string('salary_increase_id', 36);
            $table->string('probationary_contract_id', 36);
            $table->foreign('salary_increase_id')->references('id')->on('salary_increases');
            $table->foreign('probationary_contract_id')->references('id')->on('probationary_contracts');
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
