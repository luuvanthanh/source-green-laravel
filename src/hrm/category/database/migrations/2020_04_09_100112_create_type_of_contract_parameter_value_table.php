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
        Schema::create('TypeOfContractParameterValue', function (Blueprint $table) {
            $table->uuid('TypeOfContractId');
            $table->uuid('ParameterValueId');
            $table->foreign('TypeOfContractId')->references('Id')->on('TypeOfContracts');
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
        Schema::dropIfExists('TypeOfContractParameterValue');
    }
}
