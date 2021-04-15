<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDismissedDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DismissedDetails', function (Blueprint $table) {
            $table->string('Id', 36)->index()->unique();
            $table->primary('Id');
            $table->string('DismissedId', 36);
            $table->foreign('DismissedId')->references('Id')->on('Dismisseds');
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->string('BranchId', 36);
            $table->foreign('BranchId')->references('Id')->on('Branches');
            $table->string('DivisionId', 36);
            $table->foreign('DivisionId')->references('Id')->on('Divisions');
            $table->string('PositionId', 36);
            $table->foreign('PositionId')->references('Id')->on('Positions');
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
        Schema::dropIfExists('DismissedDetails');
    }
}
