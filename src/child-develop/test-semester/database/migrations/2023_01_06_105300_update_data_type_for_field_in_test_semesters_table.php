<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateDataTypeForFIeldInTestSemestersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"TestSemesters"', function (Blueprint $table) {
            $table->mediumText('Strength')->change();
            $table->mediumText('Encourage')->change();
            $table->mediumText('Suggestion')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TestSemesters', function (Blueprint $table) {
            //
        });
    }
}
