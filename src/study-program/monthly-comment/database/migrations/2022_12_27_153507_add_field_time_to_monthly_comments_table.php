<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldTimeToMonthlyCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('study-program.MonthlyComments', 'MonthlyCommentId')) {
            Schema::table('study-program.MonthlyCommentDetails', function (Blueprint $table) {
                $table->dropColumn('MonthlyCommentId');
            });
        }

        Schema::table('study-program.MonthlyComments', function (Blueprint $table) {
            $table->uuid('TeacherSentId')->nullable()->index();
            $table->uuid('MonthlyCommentId')->nullable()->index();
            $table->dateTime('SentTime')->nullable();
            $table->dateTime('ReportTime')->nullable();
            $table->dateTime('ConfirmationTime')->nullable();
            $table->integer('Type')->nullable();
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
            $table->dropColumn(['TeacherSentId', 'SentTime', 'MonthlyCommentId', 'ReportTime', 'ConfirmationTime', 'Type']);
        });
    }
}
