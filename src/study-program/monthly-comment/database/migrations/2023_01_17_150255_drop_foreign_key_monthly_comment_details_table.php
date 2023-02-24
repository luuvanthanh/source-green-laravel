<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropForeignKeyMonthlyCommentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('study-program.MonthlyCommentDetails', function (Blueprint $table) {
            $table->dropForeign('study_program_monthlycommentdetails_monthlycommentid_foreign');
            $table->foreign('MonthlyCommentId')->references('Id')->on('study-program.MonthlyComments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
