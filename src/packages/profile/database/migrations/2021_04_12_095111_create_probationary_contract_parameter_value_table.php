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
        Schema::create('ProbationaryContractParameterValue', function (Blueprint $table) {
            $table->integer('Value');
            $table->string('ProbationaryContractId', 36);
            $table->string('ParameterValueId', 36);
            $table->foreign('ProbationaryContractId')->references('id')->on('ProbationaryContracts');
            $table->foreign('ParameterValueId')->references('id')->on('ParameterValues');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ProbationaryContractParameterValue');
    }
}
