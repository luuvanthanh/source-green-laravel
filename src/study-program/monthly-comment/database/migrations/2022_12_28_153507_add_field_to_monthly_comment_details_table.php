<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToMonthlyCommentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('study-program.MonthlyCommentDetails', function (Blueprint $table) {
            $table->dropColumn('ScriptReviewCommentId');
        });

        Schema::table('study-program.MonthlyCommentDetails', function (Blueprint $table) {
            $table->boolean('IsSubject')->default(false);
            $table->boolean('IsComment')->default(false);
            $table->uuid('ScriptReviewSubjectId')->nullable()->index();
            $table->uuid('ScriptReviewCommentId')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('study-program.MonthlyCommentDetails', function (Blueprint $table) {
            $table->dropColumn(['ScriptReviewSubjectId', 'IsComment', 'IsSubject', 'ScriptReviewCommentId']);
        });
    }
}
