<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTypeOfContractParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('type_of_contract_parameter_value', function (Blueprint $table) {
            $table->string('type_of_contract_id', 36);
            $table->string('parameter_value_id', 36);
            $table->foreign('type_of_contract_id')->references('id')->on('type_of_contracts');
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
        Schema::dropIfExists('type_of_contract_parameter_value');
    }
}
