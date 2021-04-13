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
        Schema::create('dismissed_details', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('dismissed_id', 36);
            $table->foreign('dismissed_id')->references('id')->on('dismisseds');
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('SET NULL');
            $table->string('branch_id', 36);
            $table->foreign('branch_id')->references('id')->on('branchs');
            $table->string('division_id', 36);
            $table->foreign('division_id')->references('id')->on('divisions');
            $table->string('position_id', 36);
            $table->foreign('position_id')->references('id')->on('positions');
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dismissed_details');
    }
}
