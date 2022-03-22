<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateManagerCallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('manager_calls', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->uuid('customer_lead_id');
            $table->uuid('employee_id');
            $table->date('receive_date');
            $table->string('content')->nullable();
            $table->date('expected_date')->nullable();
            $table->date('date_call')->nullable();
            $table->unsignedInteger('call_times')->nullable();
            $table->unsignedInteger('status')->default(1);
            $table->unsignedInteger('before_time')->nullable();
            $table->timestamps();
            $table->foreign('customer_lead_id')->references('id')->on('customer_leads')->onDelete('cascade');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('manager_calls');
    }
}
