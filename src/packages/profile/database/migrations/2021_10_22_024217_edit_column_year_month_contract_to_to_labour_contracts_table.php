<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnYearMonthContractToToLabourContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"LabourContracts"', function (Blueprint $table) {
            $table->integer('Year')->nullable()->change();
            $table->integer('Month')->nullable()->change();
            $table->date('ContractTo')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
