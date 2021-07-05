<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldColumnToPayrollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Payrolls', function (Blueprint $table) {
            $table->json('ColumnBasicSalaryAndAllowance')->nullable();
            $table->json('ColumnIncurredAllowance')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Payrolls', function (Blueprint $table) {
            $table->dropColumn('ColumnBasicSalaryAndAllowance');
            $table->dropColumn('ColumnIncurredAllowance');
        });
    }
}
