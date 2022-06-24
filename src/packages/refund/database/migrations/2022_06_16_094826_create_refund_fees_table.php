<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefundFeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.RefundFees', function (Blueprint $table) {
            $table->uuid('Id')->index()->primary();
            $table->uuid('FeeId');
            $table->uuid('StudentRefundDetailId');
            $table->decimal('FeeRefund', 16, 2);
            $table->unsignedDecimal('FeePaid', 16, 2);
            $table->unsignedDecimal('FeeStudied', 16, 2);
            $table->foreign('FeeId')->references('Id')->on('fee.Fees');
            $table->foreign('StudentRefundDetailId')->references('Id')->on('fee.StudentRefundDetails');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee.RefundFees');
    }
}
