<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayrollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Payrolls', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->date('Month');
            $table->boolean('IsTimesheet')->default(false);
            $table->boolean('IsBonus')->default(false);
            $table->boolean('IsOther')->default(false);
            $table->boolean('IsSalary')->default(false);
            $table->json('ColumnBasicSalaryAndAllowance')->nullable();
            $table->json('ColumnIncurredAllowance')->nullable();
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
        Schema::dropIfExists('Payrolls');
    }
}
