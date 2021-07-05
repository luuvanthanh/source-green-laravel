<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnToPayRollDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('PayrollDetails', function (Blueprint $table) {
            $table->dropColumn('BasicSalary');
            $table->dropColumn('ResponsibilityAllowance');
            $table->dropColumn('GasolineCarAllowance');
            $table->dropColumn('UniformAllowance');
            $table->dropColumn('Allowance');
            $table->dropColumn('AttendanceAllowance');
            $table->dropColumn('LunchAllowance');
            $table->dropColumn('TelephoneAllowance');
            $table->dropColumn('BusAllowance');
            $table->dropColumn('SeminarAllowance');
            $table->dropColumn('LeadClassAllowance');
            $table->dropColumn('13thMonth');
            $table->dropColumn('Pursuit');
            $table->dropColumn('EvaluationBonus');
        });

        Schema::table('PayrollDetails', function (Blueprint $table) {
            $table->date('DateStartWork')->nullable();
            $table->boolean('IsProbation')->default(false);
            $table->boolean('IsMaternity')->default(false);
            $table->boolean('IsSocialInsurance')->default(false);
            $table->json('BasicSalaryAndAllowance')->nullable();
            $table->json('IncurredAllowance')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('PayrollDetails', function (Blueprint $table) {
            $table->integer('BasicSalary')->nullable();
            $table->integer('ResponsibilityAllowance')->nullable();
            $table->integer('GasolineCarAllowance')->nullable();
            $table->integer('UniformAllowance')->nullable();
            $table->integer('Allowance')->nullable();
            $table->integer('AttendanceAllowance')->nullable();
            $table->integer('LunchAllowance')->nullable();
            $table->integer('TelephoneAllowance')->nullable();
            $table->integer('BusAllowance')->nullable();
            $table->integer('SeminarAllowance')->nullable();
            $table->integer('LeadClassAllowance')->nullable();
            $table->integer('13thMonth')->nullable();
            $table->integer('Pursuit')->nullable();
            $table->integer('EvaluationBonus')->nullable();
        });

        Schema::table('PayrollDetails', function (Blueprint $table) {
            $table->dropColumn('DateStartWork');
            $table->dropColumn('IsProbation');
            $table->dropColumn('IsMaternity');
            $table->dropColumn('IsSocialInsurance');
            $table->dropColumn('BasicSalaryAndAllowance');
            $table->dropColumn('IncurredAllowance');
        });
    }

}
