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
            $table->string('Id', 36)->index()->unique();
            $table->primary('Id');
            $table->string('AddSubTimeId', 36);
            $table->foreign('AddSubTimeId')->references('Id')->on('AddSubTimes')->onDelete('cascade');
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('days')->nullable();
            $table->integer('hours')->nullable();
            $table->text('reason')->nullable();
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
