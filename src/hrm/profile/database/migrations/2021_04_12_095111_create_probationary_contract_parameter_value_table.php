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
            $table->string('Value')->nullable();
            $table->uuid('ProbationaryContractId');
            $table->uuid('ParameterValueId');
            $table->foreign('ProbationaryContractId')->references('Id')->on('ProbationaryContracts');
            $table->foreign('ParameterValueId')->references('Id')->on('ParameterValues');
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
