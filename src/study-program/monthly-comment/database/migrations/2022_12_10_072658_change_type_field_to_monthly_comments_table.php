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
        Schema::table('study-program.MonthlyComments', function (Blueprint $table) {
            $table->dropColumn(['SampleCommentId', 'Content']);
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
            $table->uuid('SampleCommentId')->nullable();
            $table->text('Content')->nullable();
        });
    }
}
