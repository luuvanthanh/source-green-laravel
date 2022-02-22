<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldShiftCodeToBusinessCardDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('BusinessCardDetails', function (Blueprint $table) {
            $table->string('ShiftCode')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('BusinessCardDetails', function (Blueprint $table) {
            $table->dropColumn('ShiftCode');
        });
    }
}
