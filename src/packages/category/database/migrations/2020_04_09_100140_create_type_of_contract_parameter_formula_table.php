<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTypeOfContractParameterFormulaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('TypeOfContractParameterFormula', function (Blueprint $table) {
            $table->string('TypeOfContractId', 36);
            $table->string('ParameterFormulaId', 36);
            $table->foreign('TypeOfContractId')->references('Id')->on('TypeOfContracts');
            $table->foreign('ParameterFormulaId')->references('Id')->on('ParameterFormulas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('TypeOfContractParameterFormula');
    }
}
