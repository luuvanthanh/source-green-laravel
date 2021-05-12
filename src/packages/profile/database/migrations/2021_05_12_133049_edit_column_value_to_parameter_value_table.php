<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnValueToParameterValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"LabourContractParameterValue"', function (Blueprint $table) {
            $table->string('Value')->nullable()->change();
        });

        Schema::table('"ProbationaryContractParameterValue"', function (Blueprint $table) {
            $table->string('Value')->nullable()->change();
        });

        Schema::table('"SalaryIncreaseParameterValue"', function (Blueprint $table) {
            $table->string('Value')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
