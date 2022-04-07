<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldPaymentStatusToChargeOldStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->integer('PaymentStatus')->default(1);
            $table->uuid('ChargeStudentIdCrm')->nullable();
        });

        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->dropColumn('TypeFee');
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
            $table->dropColumn(['PaymentStatus', 'ChargeStudentIdCrm']);
        });

        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->json('TypeFee')->nullable();
        });
    }
}
