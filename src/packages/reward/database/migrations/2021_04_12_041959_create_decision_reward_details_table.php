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
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('id')->on('Employees')->onDelete('SET NULL');
            $table->string('DecisionRewardId', 36)->unsigned();
            $table->foreign('DecisionRewardId')->references('id')->on('DecisionRewards')->onDelete('cascade');
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
