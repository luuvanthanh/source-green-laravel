<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldToMonthlyCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('study-program.MonthlyComments', 'SampleCommentId')) {
            Schema::table('study-program.MonthlyComments', function (Blueprint $table) {
                $table->dropColumn('SampleCommentId');
            });
        }

        if (Schema::hasColumn('study-program.MonthlyComments', 'Content')) {
            Schema::table('study-program.MonthlyComments', function (Blueprint $table) {
                $table->dropColumn('Content');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
