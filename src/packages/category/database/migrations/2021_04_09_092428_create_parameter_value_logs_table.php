<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParameterValueLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ParameterValueLogs', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('ParameterValueId', 36);
            $table->foreign('ParameterValueId')->references('id')->on('ParameterValues');
            $table->string('EditEmployee', 36);
            $table->foreign('EditEmployee')->references('id')->on('Employees')->onDelete('SET NULL');
            $table->date('EditDate');
            $table->string('ValueDefault')->nullable();
            $table->date('ApplyDate')->nullable();
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
        Schema::dropIfExists('ParameterValueLogs');
    }
}
