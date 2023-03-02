<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldStudentIdAndFieldFeeInfoAndFieldTotalMoneyMonthToPaymentPlanDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.PaymentPlanDetails', function (Blueprint $table) {
            $table->uuid('StudentId')->nullable();
            $table->json('FeeInfo')->nullable();
            $table->string('TotalMoneyMonth')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.PaymentPlanDetails', function (Blueprint $table) {
            $table->dropColumn('StudentId', 'FeeInfo', 'TotalMoneyMonth');
        });
    }
}
