<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldFullMonthToChangeParameterDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.ChangeParameterDetails', function (Blueprint $table) {
            $table->dropColumn('FullMonth');
        });

        Schema::table('fee.ChangeParameterDetails', function (Blueprint $table) {
            $table->float('FullMonth')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.ChangeParameterDetails', function (Blueprint $table) {
            //
        });
    }
}
