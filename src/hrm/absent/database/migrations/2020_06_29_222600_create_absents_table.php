<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbsentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Absents', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->uuid('AbsentTypeId');
            $table->foreign('AbsentTypeId')->references('Id')->on('AbsentTypes');
            $table->uuid('AbsentReasonId')->nullable();
            $table->foreign('AbsentReasonId')->references('Id')->on('AbsentReasons');
            $table->date('StartDate');
            $table->date('EndDate')->nullable();
            $table->string('Reason')->nullable();
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
        Schema::dropIfExists('Absents');
    }
}
