<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddShiftIdToAbsentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('AbsentDetails', function (Blueprint $table) {
            $table->uuid('ShiftId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('AbsentDetails', function (Blueprint $table) {
            $table->dropColumn('ShiftId');
        });
    }
}
