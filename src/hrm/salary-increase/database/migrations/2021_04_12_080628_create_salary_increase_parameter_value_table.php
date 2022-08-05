<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalaryIncreaseParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('SalaryIncreaseParameterValue', function (Blueprint $table) {
            $table->string('Value')->nullable();
            $table->uuid('SalaryIncreaseId');
            $table->uuid('ParameterValueId');
            $table->foreign('SalaryIncreaseId')->references('Id')->on('SalaryIncreases');
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
        Schema::dropIfExists('SalaryIncreaseParameterValue');
    }
}
