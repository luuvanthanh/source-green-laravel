<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeasonalContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('SeasonalContracts', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('ContractNumber');
            $table->date('ContractDate');
            $table->uuid('TypeOfContractId');
            $table->uuid('EmployeeId');
            $table->integer('Month');
            $table->integer('Date');
            $table->uuid('DivisionId');
            $table->uuid('PositionId');
            $table->date('ContractFrom');
            $table->date('ContractTo');
            $table->string('WorkDetail');
            $table->string('WorkTime');
            $table->string('NameProject');
            $table->boolean('JoinSocialInsurance')->default('false');
            $table->boolean('Project')->default('false');
            $table->uuid('BranchId');
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
        Schema::dropIfExists('SeasonalContracts');
    }
}
