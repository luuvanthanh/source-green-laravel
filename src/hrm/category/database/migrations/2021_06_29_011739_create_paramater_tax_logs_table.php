<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParamaterTaxLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ParameterTaxLogs', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ParameterTaxId');
            $table->foreign('ParameterTaxId')->references('Id')->on('ParameterTaxs')->onDelete('cascade');
            $table->uuid('EditEmployee');
            $table->date('EditDate');
            $table->integer('From')->nullable();
            $table->integer('To')->nullable();
            $table->integer('Fax');
            $table->date('ApplyDate');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ParameterTaxLogs');
    }
}
