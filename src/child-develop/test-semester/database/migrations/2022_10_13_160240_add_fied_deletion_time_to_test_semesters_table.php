<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFiedDeletionTimeToTestSemestersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TestSemesters', function (Blueprint $table) {
            $table->softDeletes('DeletedAt', 0)->nullable();
        });

        Schema::table('TestSemesterDetails', function (Blueprint $table) {
            $table->softDeletes('DeletedAt', 0)->nullable();
        });

        Schema::table('TestSemesterDetailChildrens', function (Blueprint $table) {
            $table->softDeletes('DeletedAt', 0)->nullable();
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
            $table->dropSoftDeletes('DeletedAt');
        });

        Schema::table('TestSemesterDetails', function (Blueprint $table) {
            $table->dropSoftDeletes('DeletedAt');
        });

        Schema::table('TestSemesterDetailChildrens', function (Blueprint $table) {
            $table->dropSoftDeletes('DeletedAt');
        });
    }
}
