<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeFieldDecisionDateToAppointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Appoints', function (Blueprint $table) {
            $table->dropColumn('DecisionDate');
        });
        Schema::table('DecisionSuspends', function (Blueprint $table) {
            $table->dropColumn('DecisionDate');
        });
        Schema::table('Dismisseds', function (Blueprint $table) {
            $table->dropColumn('DecisionDate');
        });
        Schema::table('ResignationDecisions', function (Blueprint $table) {
            $table->dropColumn('DecisionDate');
        });
        Schema::table('SalaryIncreases', function (Blueprint $table) {
            $table->dropColumn('DecisionDate');
        });
        Schema::table('Transfers', function (Blueprint $table) {
            $table->dropColumn('DecisionDate');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Appoints', function (Blueprint $table) {
            //
        });
    }
}
