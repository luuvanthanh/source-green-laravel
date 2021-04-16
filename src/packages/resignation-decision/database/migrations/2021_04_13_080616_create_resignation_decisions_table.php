<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResignationDecisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ResignationDecisions', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('DecisionNumber');
            $table->string('DecisionDate');
            $table->string('Reason')->nullable();
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->date('TimeApply');
            $table->date('PayEndDate');
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
        Schema::dropIfExists('ResignationDecisions');
    }
}
