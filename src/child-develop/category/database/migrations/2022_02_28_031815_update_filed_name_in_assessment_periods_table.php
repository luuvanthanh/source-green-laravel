<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFiledNameInAssessmentPeriodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('AssessmentPeriods', function (Blueprint $table) {
            $table->uuid('NameAssessmentPeriodId')->nullable();
        });

        Schema::table('"AssessmentPeriods"', function (Blueprint $table) {
            $table->string('Name')->nullable()->change();
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
            $table->dropColumn('NameAssessmentPeriodId');
        });
    }
}
