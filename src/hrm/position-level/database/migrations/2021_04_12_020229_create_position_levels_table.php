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
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->uuid('BranchId');
            $table->foreign('BranchId')->references('Id')->on('Branches');
            $table->uuid('PositionId');
            $table->foreign('PositionId')->references('Id')->on('Positions');
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions');
            $table->date('StartDate');
            $table->date('EndDate')->nullable();
            $table->string('Type')->nullable();
            $table->uuid('ModelId')->nullable();
            $table->string('ModelType')->nullable();
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
