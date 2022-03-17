<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollaboratorContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CollaboratorContracts', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('ContractNumber');
            $table->date('ContractDate');
            $table->uuid('TypeOfContractId');
            $table->uuid('EmployeeId');
            $table->integer('Year')->nullable();
            $table->integer('Month')->nullable();
            $table->uuid('DivisionId');
            $table->date('ContractFrom');
            $table->date('ContractTo')->nullable();
            $table->uuid('PositionId');
            $table->string('Work');
            $table->string('WorkTime');
            $table->uuid('BranchId');
            $table->float('TotalAllowance')->nullable();
            $table->float('BasicSalary')->nullable();
            $table->boolean('IsSocialInsurance')->default(false);
            $table->boolean('IsEffect')->default(true);
            $table->string('File', 1000)->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CollaboratorContracts');
    }
}
