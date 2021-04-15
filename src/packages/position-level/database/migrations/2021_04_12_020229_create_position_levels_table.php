<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePositionLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('PositionLevels', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('id')->on('Employees')->onDelete('SET NULL');
            $table->string('BranchId', 36);
            $table->foreign('BranchId')->references('id')->on('Branches');
            $table->string('PositionId', 36);
            $table->foreign('PositionId')->references('id')->on('Positions');
            $table->string('DivisionId', 36);
            $table->foreign('DivisionId')->references('id')->on('Divisions');
            $table->date('StartDate');
            $table->date('EndDate')->nullable();
            $table->string('Type')->nullable();
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
        Schema::dropIfExists('PositionLevels');
    }
}
