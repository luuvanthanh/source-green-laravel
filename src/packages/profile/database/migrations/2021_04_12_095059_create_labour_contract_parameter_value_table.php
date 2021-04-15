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
        Schema::create('LabourContractParameterValue', function (Blueprint $table) {
            $table->integer('Value');
            $table->string('LabourContractId', 36);
            $table->string('ParameterValueId', 36);
            $table->foreign('LabourContractId')->references('Id')->on('LabourContracts');
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
        Schema::dropIfExists('LabourContractParameterValue');
    }
}
