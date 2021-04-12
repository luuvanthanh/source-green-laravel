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
        Schema::create('salary_increase_parameter_value', function (Blueprint $table) {
            $table->integer('value');
            $table->string('salary_increase_id', 36);
            $table->string('parameter_value_id', 36);
            $table->foreign('salary_increase_id')->references('id')->on('salary_increases');
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
        Schema::dropIfExists('salary_increase_parameter_value');
    }
}
