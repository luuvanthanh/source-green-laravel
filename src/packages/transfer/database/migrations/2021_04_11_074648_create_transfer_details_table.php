<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransferDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('TransferDetails', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('TransferId', 36);
            $table->foreign('TransferId')->references('id')->on('Transfers');
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('id')->on('Employees')->onDelete('SET NULL');
            $table->string('BranchId', 36);
            $table->foreign('BranchId')->references('id')->on('Branches');
            $table->string('DivisionId', 36);
            $table->foreign('DivisionId')->references('id')->on('Divisions');
            $table->string('PositionId', 36);
            $table->foreign('PositionId')->references('id')->on('Positions');
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
        Schema::dropIfExists('TransferDetails');
    }
}
