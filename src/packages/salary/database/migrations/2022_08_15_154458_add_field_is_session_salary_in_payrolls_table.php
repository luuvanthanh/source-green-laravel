<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIsSessionSalaryInPayrollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Payrolls', function (Blueprint $table) {
            $table->boolean('IsSessionSalary')->default(false);
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
            $table->dropColumn('IsSessionSalary');
        });
    }
}
