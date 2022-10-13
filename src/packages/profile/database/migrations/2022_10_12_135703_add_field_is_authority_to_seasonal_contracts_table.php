<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIsAuthorityToSeasonalContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('SeasonalContracts', function (Blueprint $table) {
            $table->boolean('IsAuthority')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('SeasonalContracts', function (Blueprint $table) {
            $table->dropColumn('IsAuthority');
        });
    }
}
