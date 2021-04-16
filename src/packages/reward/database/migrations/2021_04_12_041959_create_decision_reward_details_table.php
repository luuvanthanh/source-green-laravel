<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDecisionRewardDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DecisionRewardDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->uuid('DecisionRewardId')->unsigned();
            $table->foreign('DecisionRewardId')->references('Id')->on('DecisionRewards')->onDelete('cascade');
            $table->integer('Money');
            $table->date('TimeApply')->nullable();
            $table->string('Note')->nullable();
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
        Schema::dropIfExists('DecisionRewardDetails');
    }
}
