<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddSubTimeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('AddSubTimeDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('AddSubTimeId');
            $table->foreign('AddSubTimeId')->references('Id')->on('AddSubTimes')->onDelete('cascade');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->date('StartDate');
            $table->date('EndDate');
            $table->integer('Days')->nullable();
            $table->integer('Hours')->nullable();
            $table->text('Reason')->nullable();
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
        Schema::dropIfExists('AddSubTimeDetails');
    }
}
