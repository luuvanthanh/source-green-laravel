<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldNullableProbationaryContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"ProbationaryContracts"', function (Blueprint $table) {
            $table->string('ContractNumber')->nullable()->change();
            $table->date('ContractDate')->nullable()->change();
            $table->uuid('TypeOfContractId')->nullable()->change();
            $table->integer('SalaryRatio')->nullable()->change();
            $table->integer('Month')->nullable()->change();
            $table->uuid('DivisionId')->nullable()->change();
            $table->date('ContractFrom')->nullable()->change();
            $table->date('ContractTo')->nullable()->change();
            $table->uuid('PositionId')->nullable()->change();
            $table->string('Work')->nullable()->change();
            $table->string('WorkTime')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
