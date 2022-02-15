<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFiledPaymentFormCrmIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.PaymentForms', function (Blueprint $table) {
            $table->uuid('PaymentFormCrmId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.PaymentForms', function (Blueprint $table) {
            $table->dropColumn('PaymentFormCrmId');
        });
    }
}
