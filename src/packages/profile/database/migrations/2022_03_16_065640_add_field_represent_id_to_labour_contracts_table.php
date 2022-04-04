<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldRepresentIdToLabourContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('LabourContracts', function (Blueprint $table) {
            $table->uuid('RepresentId')->nullable();
        });
        Schema::table('ProbationaryContracts', function (Blueprint $table) {
            $table->uuid('RepresentId')->nullable();
        });
        Schema::table('SeasonalContracts', function (Blueprint $table) {
            $table->uuid('RepresentId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('LabourContracts', function (Blueprint $table) {
            $table->dropColumn('RepresentId');
        });
        Schema::table('ProbationaryContracts', function (Blueprint $table) {
            $table->dropColumn('RepresentId');
        });
        Schema::table('SeasonalContracts', function (Blueprint $table) {
            $table->dropColumn('RepresentId');
        });
    }
}
