<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToShiftDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ShiftDetails', function (Blueprint $table) {
            $table->time('AfterStart')->nullable();
            $table->time('BeforeEnd')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ShiftDetails', function (Blueprint $table) {
            $table->dropColumn('AfterStart');
            $table->dropColumn('BeforeEnd');
        });
    }
}
