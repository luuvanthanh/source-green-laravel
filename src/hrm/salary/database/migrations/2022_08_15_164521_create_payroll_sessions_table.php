<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayrollSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('PayrollSessions', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('PayrollId');
            $table->uuid('EmployeeId');
            $table->decimal('TotalIncome', 12, 2)->nullable();
            $table->decimal('BasicSalary', 12, 2)->nullable();
            $table->decimal('WorkDay', 12, 2)->nullable();
            $table->decimal('Allowance', 12, 2)->nullable();
            $table->decimal('PersonalIncomeTax', 12, 2)->nullable();
            $table->decimal('TaxPayment', 12, 2)->nullable();
            $table->decimal('ValueSalary', 12, 2)->nullable();
            $table->decimal('Deduction', 12, 2)->nullable();
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
        Schema::dropIfExists('PayrollSessions');
    }
}
