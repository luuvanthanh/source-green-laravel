<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldSerialNumberToTestSemesterDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TestSemesterDetails', function (Blueprint $table) {
            $table->integer('SerialNumber')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TestSemesterDetails', function (Blueprint $table) {
            $table->dropColumn('SerialNumber');
        });
    }
}
