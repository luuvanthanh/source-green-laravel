<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefundDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.RefundDetails', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('RefundId');
            $table->uuid('FeeId');
            $table->date('StartDate');
            $table->date('EndDate');
            $table->timestamp('CreationTime');
            $table->timestamp('LastModificationTime');
            $table->foreign('RefundId')->references('Id')->on('fee.Refunds')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee.RefundDetails');
    }
}
