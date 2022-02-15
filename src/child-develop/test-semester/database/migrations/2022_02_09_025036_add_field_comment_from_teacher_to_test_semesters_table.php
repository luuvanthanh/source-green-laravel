<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCommentFromTeacherToTestSemestersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TestSemesters', function (Blueprint $table) {
            $table->string('Strength')->nullable();
            $table->string('Encourage')->nullable();
            $table->uuid('ClassTypeId')->nullable();
            $table->float('TimeAgeTestSemester')->nullable();
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
            $table->dropColumn('Strength');
            $table->dropColumn('Encourage');
            $table->dropColumn('ClassTypeId');
            $table->dropColumn('TimeAgeTestSemester');
        });
    }
}
