<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameColumnDateInHolidayDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"HolidayDetails"', function (Blueprint $table) {
            $table->renameColumn('"Date"', '"StartDate"');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"HolidayDetails"', function (Blueprint $table) {
            $table->renameColumn('"StartDate"', '"Date"');
        });
    }
}
