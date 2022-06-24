<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefundStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.RefundStudents', function (Blueprint $table) {
            $table->uuid('Id')->index()->primary();
            $table->uuid('RefundId');
            $table->uuid('BranchId');
            $table->string('Month');
            $table->string('Type');
            $table->timestamp('CreationTime');
            $table->timestamp('LastModificationTime');
            $table->foreign('RefundId')->references('Id')->on('fee.Refunds');
            $table->foreign('BranchId')->references('Id')->on('Branches');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee.RefundStudents');
    }
}
