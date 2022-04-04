<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssessmentPeriodBranchsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('AssessmentPeriodBranchs', function (Blueprint $table) {
            $table->uuid('AssessmentPeriodId');
            $table->uuid('BranchId');
        });

        if (Schema::hasColumn('AssessmentPeriods', 'BranchId')) {
            Schema::table('AssessmentPeriods', function (Blueprint $table) {
                $table->dropColumn('BranchId');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('AssessmentPeriodBranchs');
    }
}
