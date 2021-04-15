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
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('ContractNumber');
            $table->date('ContractDate');
            $table->string('TypeOfContractId');
            $table->foreign('TypeOfContractId')->references('id')->on('TypeOfContracts');
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('id')->on('Employees')->onDelete('SET NULL');
            $table->integer('SalaryRatio');
            $table->integer('Month');
            $table->string('DivisionId', 36);
            $table->foreign('DivisionId')->references('id')->on('Divisions');
            $table->date('ContractFrom');
            $table->date('ContractTo');
            $table->string('PositionId', 36);
            $table->foreign('PositionId')->references('id')->on('Positions');
            $table->string('Work');
            $table->string('WorkTime');
            $table->string('BranchId', 36);
            $table->foreign('BranchId')->references('id')->on('Branches');
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
