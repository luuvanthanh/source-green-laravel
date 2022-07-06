<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNumberFormContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('NumberFormContracts', function (Blueprint $table) {
            $table->uuid('Id')->index()->primary();
            $table->string('Type');
            $table->string('OrdinalNumber');
            $table->string('NumberForm');
            $table->date('StartDate');
            $table->date('EndDate');
            $table->timestamp('CreationTime');
            $table->timestamp('LastModificationTime');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('NumberFormContracts');
    }
}
