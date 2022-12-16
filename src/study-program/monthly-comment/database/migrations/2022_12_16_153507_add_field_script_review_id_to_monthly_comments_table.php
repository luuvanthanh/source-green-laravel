<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldScriptReviewIdToMonthlyCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('study-program.MonthlyComments', function (Blueprint $table) {
            $table->uuid('ScriptReviewId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('study-program.MonthlyComments', function (Blueprint $table) {
            $table->dropColumn('ScriptReviewId');
        });
    }
}
