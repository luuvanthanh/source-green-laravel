<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditForeignToTypeOfContractParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TypeOfContractParameterValue', function (Blueprint $table) {
            $table->dropForeign(['TypeOfContractId']);
            $table->foreign('TypeOfContractId')->references('Id')->on('TypeOfContracts')->onDelete('cascade');

            $table->dropForeign(['ParameterValueId']);
            $table->foreign('ParameterValueId')->references('Id')->on('ParameterValues')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TypeOfContractParameterValue', function (Blueprint $table) {
            //
        });
    }
}
