<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDecisionSuspendsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DecisionSuspends', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('DecisionNumber');
            $table->string('DecisionDate');
            $table->string('Reason')->nullable();
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('id')->on('Employees')->onDelete('SET NULL');
            $table->date('From');
            $table->date('To');
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
        Schema::dropIfExists('DecisionSuspends');
    }
}
