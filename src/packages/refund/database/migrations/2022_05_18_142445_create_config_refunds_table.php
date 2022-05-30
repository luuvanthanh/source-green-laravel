<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConfigRefundsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.ConfigRefunds', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('RefundDetailId');
            $table->uuid('PaymentFormId');
            $table->string('Type');
            $table->foreign('RefundDetailId')->references('Id')->on('fee.RefundDetails')->onDelete('cascade');
            $table->foreign('PaymentFormId')->references('Id')->on('fee.PaymentForms')->onDelete('cascade');
            $table->timestamp('CreationTime');
            $table->timestamp('LastModificationTime');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee.ConfigRefunds');
    }
}
