<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldActuallyReceivedToPayrollDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"PayrollDetails"', function (Blueprint $table) {
            $table->bigInteger('"ActuallyReceived"')->nullable()->change();
            $table->bigInteger('"TotalIncome"')->nullable()->change();
            $table->bigInteger('"KpiBonus"')->nullable()->change();
            $table->bigInteger('"OtTax"')->nullable()->change();
            $table->bigInteger('"OtNoTax"')->nullable()->change();
            $table->bigInteger('"UnpaidLeave"')->nullable()->change();
            $table->bigInteger('"TotalWork"')->nullable()->change();
            $table->bigInteger('"TotalIncomeMonth"')->nullable()->change();
            $table->bigInteger('"SocialInsuranceEmployee"')->nullable()->change();
            $table->bigInteger('"SocialInsuranceAdjustedEmployee"')->nullable()->change();
            $table->bigInteger('"SocialInsuranceCompany"')->nullable()->change();
            $table->bigInteger('"SocialInsuranceAdjustedCompany"')->nullable()->change();
            $table->bigInteger('"HealthInsuranceEmployee"')->nullable()->change();
            $table->bigInteger('"HealthInsuranceCompany"')->nullable()->change();
            $table->bigInteger('"UnemploymentInsuranceEmployee"')->nullable()->change();
            $table->bigInteger('"UnemploymentInsuranceCompany"')->nullable()->change();
            $table->bigInteger('"UnionDues"')->nullable()->change();
            $table->bigInteger('"DependentPerson"')->nullable()->change();
            $table->bigInteger('"Eeduce"')->nullable()->change();
            $table->bigInteger('"Charity"')->nullable()->change();
            $table->bigInteger('"TotalReduce"')->nullable()->change();
            $table->bigInteger('"RentalIncome"')->nullable()->change();
            $table->bigInteger('"PersonalIncomeTax"')->nullable()->change();
            $table->bigInteger('"SocialInsurancePayment"')->nullable()->change();
            $table->bigInteger('"Advance"')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"PayrollDetails"', function (Blueprint $table) {
            //
        });
    }
}
