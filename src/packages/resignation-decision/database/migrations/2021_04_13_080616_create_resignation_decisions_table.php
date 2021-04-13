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
        Schema::create('resignation_decisions', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('decision_number');
            $table->string('decision_date');
            $table->string('reason')->nullable();
            $table->bigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('SET NULL');
            $table->date('time_apply');
            $table->date('pay_end_date');
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
        Schema::dropIfExists('resignation_decisions');
    }
}
