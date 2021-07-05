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
            $table->integer('TotalIncome')->nullable();
            $table->integer('BasicSalary')->nullable();
            $table->integer('ResponsibilityAllowance')->nullable();
            $table->integer('GasolineCarAllowance')->nullable();
            $table->integer('UniformAllowance')->nullable();
            $table->integer('Allowance')->nullable();
            $table->integer('AttendanceAllowance')->nullable();
            $table->integer('LunchAllowance')->nullable();
            $table->integer('TelephoneAllowance')->nullable();
            $table->integer('SeminarAllowance')->nullable();
            $table->integer('BusAllowance')->nullable();
            $table->integer('LeadClassAllowance')->nullable();
            $table->integer('13thMonth')->nullable();
            $table->integer('KpiBonus')->nullable();
            $table->integer('Pursuit')->nullable();
            $table->integer('EvaluationBonus')->nullable();
            $table->integer('OtTax')->nullable();
            $table->integer('OtNoTax')->nullable();
            $table->integer('UnpaidLeave')->nullable();
            $table->integer('TotalWork')->nullable();
            $table->integer('TotalIncomeMonth')->nullable();
            $table->integer('SocialInsuranceEmployee')->nullable();
            $table->integer('SocialInsuranceAdjustedEmployee')->nullable();
            $table->integer('SocialInsuranceCompany')->nullable();
            $table->integer('SocialInsuranceAdjustedCompany')->nullable();
            $table->integer('HealthInsuranceEmployee')->nullable();
            $table->integer('HealthInsuranceCompany')->nullable();
            $table->integer('UnemploymentInsuranceEmployee')->nullable();
            $table->integer('UnemploymentInsuranceCompany')->nullable();
            $table->integer('UnionDues')->nullable();
            $table->integer('DependentPerson')->nullable();
            $table->integer('Eeduce')->nullable();
            $table->integer('Charity')->nullable();
            $table->integer('TotalReduce')->nullable();
            $table->integer('RentalIncome')->nullable();
            $table->integer('PersonalIncomeTax')->nullable();
            $table->integer('SocialInsurancePayment')->nullable();
            $table->integer('Advance')->nullable();
            $table->integer('ActuallyReceived')->nullable();
            $table->string('Note')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
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
