<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIsEffectToContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('LabourContracts', function (Blueprint $table) {
            $table->boolean('IsEffect')->default(true);
        });

        Schema::table('ProbationaryContracts', function (Blueprint $table) {
            $table->boolean('IsEffect')->default(true);
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
            $table->dropColumn('IsEffect');
        });

        Schema::table('ProbationaryContracts', function (Blueprint $table) {
            $table->dropColumn('IsEffect');
        });
    }
}
