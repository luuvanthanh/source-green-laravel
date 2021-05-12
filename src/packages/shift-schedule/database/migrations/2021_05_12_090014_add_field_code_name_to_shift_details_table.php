<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCodeNameToShiftDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ShiftDetails', function (Blueprint $table) {
            $table->string('Name')->nullable();
            $table->string('Code')->nullable();
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
            $table->dropColumn('Name');
            $table->dropColumn('Code');
        });
    }
}
