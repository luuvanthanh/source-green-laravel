<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldAgeToTestSemesterDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TestSemesterDetailChildrens', function (Blueprint $table) {
            $table->string('Age')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TestSemesterDetailChildrens', function (Blueprint $table) {
            $table->dropColumn('Age');
        });
    }
}
