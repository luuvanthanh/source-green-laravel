<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIntroductionAndPeriodicToAssessmentPeriodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('AssessmentPeriods', function (Blueprint $table) {
            $table->boolean('Introduction')->default(false);
            $table->boolean('Periodic')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('AssessmentPeriods', function (Blueprint $table) {
            $table->dropColumn('Introduction');
            $table->dropColumn('Periodic');
        });
    }
}
