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
        Schema::create('probationary_contracts', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('contract_number');
            $table->date('contract_date');
            $table->string('type_of_contract_id');
            $table->foreign('type_of_contract_id')->references('id')->on('type_of_contracts');
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('SET NULL');
            $table->integer('salary_ratio');
            $table->integer('month');
            $table->string('division_id', 36);
            $table->foreign('division_id')->references('id')->on('divisions');
            $table->date('contract_from');
            $table->date('contract_to');
            $table->string('position_id', 36);
            $table->foreign('position_id')->references('id')->on('positions');
            $table->string('work');
            $table->string('work_time');
            $table->string('branch_id', 36);
            $table->foreign('branch_id')->references('id')->on('branchs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('probationary_contracts');
    }
}
