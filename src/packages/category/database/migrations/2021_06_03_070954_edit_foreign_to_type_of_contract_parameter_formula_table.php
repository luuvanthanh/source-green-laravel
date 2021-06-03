<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditForeignToTypeOfContractParameterFormulaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TypeOfContractParameterFormula', function (Blueprint $table) {
            $table->dropForeign(['TypeOfContractId']);
            $table->foreign('TypeOfContractId')->references('Id')->on('TypeOfContracts')->onDelete('cascade');

            $table->dropForeign(['ParameterFormulaId']);
            $table->foreign('ParameterFormulaId')->references('Id')->on('ParameterFormulas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TypeOfContractParameterFormula', function (Blueprint $table) {
            //
        });
    }
}
