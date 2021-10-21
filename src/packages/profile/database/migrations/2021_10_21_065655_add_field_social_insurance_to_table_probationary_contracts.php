<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldSocialInsuranceToTableProbationaryContracts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ProbationaryContracts', function (Blueprint $table) {
            $table->boolean('IsSocialInsurance')->nullable()->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ProbationaryContracts', function (Blueprint $table) {
            $table->dropColumn('IsSocialInsurance');
        });
    }
}
