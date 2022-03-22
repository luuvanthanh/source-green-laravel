<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoryCallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('history_calls', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->uuid('customer_lead_id')->nullable();
            $table->string('phone')->nullable();
            $table->string('call_sid');
            $table->string('call_status');
            $table->string('record_link')->nullable();
            $table->string('direction');
            $table->timestamps();
            $table->foreign('customer_lead_id')->references('id')->on('customer_leads')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('history_calls');
    }
}
