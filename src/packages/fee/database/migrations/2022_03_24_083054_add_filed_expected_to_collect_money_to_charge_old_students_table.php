<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFiledExpectedToCollectMoneyToChargeOldStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->json('ExpectedToCollectMoney')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->dropColumn('ExpectedToCollectMoney');
        });
    }
}
