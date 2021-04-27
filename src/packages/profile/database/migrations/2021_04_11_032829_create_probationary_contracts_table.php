<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProbationaryContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ProbationaryContracts', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('ContractNumber');
            $table->date('ContractDate');
            $table->uuid('TypeOfContractId');
            $table->foreign('TypeOfContractId')->references('Id')->on('TypeOfContracts');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->integer('SalaryRatio');
            $table->integer('Month');
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions');
            $table->date('ContractFrom');
            $table->date('ContractTo');
            $table->uuid('PositionId');
            $table->foreign('PositionId')->references('Id')->on('Positions');
            $table->string('Work');
            $table->string('WorkTime');
            $table->uuid('BranchId');
            $table->foreign('BranchId')->references('Id')->on('Branches');
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
        Schema::dropIfExists('ProbationaryContracts');
    }
}
