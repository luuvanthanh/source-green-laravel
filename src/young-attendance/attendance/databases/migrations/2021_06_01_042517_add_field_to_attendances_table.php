<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToAttendancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Attendances', function (Blueprint $table) {
            $table->time('CheckIn')->nullable();
            $table->time('CheckOut')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Attendances', function (Blueprint $table) {
            $table->dropColumn('CheckIn');
            $table->dropColumn('CheckOut');
        });
    }
}
