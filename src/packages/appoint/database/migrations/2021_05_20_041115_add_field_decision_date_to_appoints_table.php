<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldDecisionDateToAppointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Appoints', function (Blueprint $table) {
            $table->date('DecisionDate')->nullable();
            $table->date('TimeApply')->nullable();
        });
        Schema::table('DecisionSuspends', function (Blueprint $table) {
            $table->date('DecisionDate')->nullable();
            $table->date('TimeApply')->nullable();
        });
        Schema::table('Dismisseds', function (Blueprint $table) {
            $table->date('DecisionDate')->nullable();
            $table->date('TimeApply')->nullable();
        });
        Schema::table('ResignationDecisions', function (Blueprint $table) {
            $table->date('DecisionDate')->nullable();
        });
        Schema::table('SalaryIncreases', function (Blueprint $table) {
            $table->date('DecisionDate')->nullable();
        });
        Schema::table('Transfers', function (Blueprint $table) {
            $table->date('DecisionDate')->nullable();
            $table->date('TimeApply')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('appoints', function (Blueprint $table) {
            //
        });
    }
}
