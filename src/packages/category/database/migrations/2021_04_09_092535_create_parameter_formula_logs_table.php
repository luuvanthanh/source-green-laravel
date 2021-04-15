<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParameterFormulaLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ParameterFormulaLogs', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('ParameterFormulaId', 36);
            $table->foreign('ParameterFormulaId')->references('id')->on('ParameterFormulas');
            $table->string('EditEmployee', 36);
            $table->foreign('EditEmployee')->references('id')->on('Employees')->onDelete('SET NULL');
            $table->date('EditDate');
            $table->date('ApplyDate')->nullable();
            $table->string('Name');
            $table->string('Recipe')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ParameterFormulaLogs');
    }
}
