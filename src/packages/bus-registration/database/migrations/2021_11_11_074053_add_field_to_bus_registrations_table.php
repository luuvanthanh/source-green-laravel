<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToBusRegistrationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"BusRegistrations"', function (Blueprint $table) {
            $table->date('"Date"')->nullable()->change();
        });

        Schema::table('BusRegistrations', function (Blueprint $table) {
            $table->date('StartDate')->nullable();
            $table->date('EndDate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('BusRegistrations', function (Blueprint $table) {
            $table->dropColumn('StartDate');
            $table->dropColumn('EndDate');
        });
    }
}
