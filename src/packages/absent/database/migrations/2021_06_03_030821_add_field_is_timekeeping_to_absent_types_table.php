<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIsTimekeepingToAbsentTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('AbsentTypes', function (Blueprint $table) {
            $table->boolean('IsTimeKeeping')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('AbsentTypes', function (Blueprint $table) {
            $table->dropColumn('IsTimeKeeping');
        });
    }
}
