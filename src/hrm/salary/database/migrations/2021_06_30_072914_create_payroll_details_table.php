<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayrollDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('PayrollDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('PayrollId');
            $table->foreign('PayrollId')->references('Id')->on('Payrolls')->onDelete('cascade');
            $table->uuid('EmployeeId');
            $table->bigInteger('TotalIncome')->nullable();
            $table->bigInteger('KpiBonus')->nullable();
            $table->bigInteger('OtTax')->nullable();
            $table->bigInteger('OtNoTax')->nullable();
            $table->bigInteger('UnpaidLeave')->nullable();
            $table->bigInteger('TotalWork')->nullable();
            $table->bigInteger('TotalIncomeMonth')->nullable();
            $table->bigInteger('SocialInsuranceEmployee')->nullable();
            $table->bigInteger('SocialInsuranceAdjustedEmployee')->nullable();
            $table->bigInteger('SocialInsuranceCompany')->nullable();
            $table->bigInteger('SocialInsuranceAdjustedCompany')->nullable();
            $table->bigInteger('HealthInsuranceEmployee')->nullable();
            $table->bigInteger('HealthInsuranceCompany')->nullable();
            $table->bigInteger('UnemploymentInsuranceEmployee')->nullable();
            $table->bigInteger('UnemploymentInsuranceCompany')->nullable();
            $table->bigInteger('UnionDues')->nullable();
            $table->bigInteger('DependentPerson')->nullable();
            $table->bigInteger('Eeduce')->nullable();
            $table->bigInteger('Charity')->nullable();
            $table->bigInteger('TotalReduce')->nullable();
            $table->bigInteger('RentalIncome')->nullable();
            $table->bigInteger('PersonalIncomeTax')->nullable();
            $table->bigInteger('SocialInsurancePayment')->nullable();
            $table->bigInteger('Advance')->nullable();
            $table->bigInteger('ActuallyReceived')->nullable();
            $table->string('Note')->nullable();
            $table->date('DateStartWork')->nullable();
            $table->boolean('IsProbation')->default(false);
            $table->boolean('IsMaternity')->default(false);
            $table->boolean('IsSocialInsurance')->default(false);
            $table->json('BasicSalaryAndAllowance')->nullable();
            $table->json('IncurredAllowance')->nullable();
            $table->float('SalaryByHour', 12, 2)->nullable();
            $table->float('OtWeekday')->nullable();
            $table->float('OtWeekend')->nullable();
            $table->float('OtHoliday')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('PayrollDetails');
    }
}
