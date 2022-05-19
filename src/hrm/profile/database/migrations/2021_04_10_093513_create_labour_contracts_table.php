<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLabourContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('LabourContracts', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('ContractNumber');
            $table->date('ContractDate');
            $table->uuid('TypeOfContractId');
            $table->foreign('TypeOfContractId')->references('Id')->on('TypeOfContracts');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->integer('Year')->nullable();
            $table->integer('Month')->nullable();
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions');
            $table->date('ContractFrom');
            $table->date('ContractTo')->nullable();
            $table->uuid('PositionId');
            $table->foreign('PositionId')->references('Id')->on('Positions');
            $table->string('Work');
            $table->string('WorkTime');
            $table->uuid('BranchId');
            $table->foreign('BranchId')->references('Id')->on('Branches');
            $table->float('TotalAllowance')->nullable();
            $table->float('BasicSalary')->nullable();
            $table->boolean('IsSocialInsurance')->default(false);
            $table->boolean('IsEffect')->default(true);
            $table->string('File', 1000)->nullable();
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
        Schema::dropIfExists('LabourContracts');
    }
}
