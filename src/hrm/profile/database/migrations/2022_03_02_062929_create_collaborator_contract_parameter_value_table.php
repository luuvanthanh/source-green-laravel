<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollaboratorContractParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CollaboratorContractParameterValue', function (Blueprint $table) {
            $table->integer('Value');
            $table->uuid('CollaboratorContractId');
            $table->uuid('ParameterValueId');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CollaboratorContractParameterValue');
    }
}
