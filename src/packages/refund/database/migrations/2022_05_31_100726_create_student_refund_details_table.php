<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentRefundDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.StudentRefundDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->primary();
            $table->uuid('RefundStudentId');
            $table->uuid('StudentId');
            $table->date('DateOff');
            $table->unsignedInteger('NumberDayOff')->nullable();
            $table->foreign('RefundStudentId')->references('Id')->on('fee.RefundStudents');
            $table->foreign('StudentId')->references('Id')->on('object.Students');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee.StudentRefundDetails');
    }
}
