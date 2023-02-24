<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonthlyCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.MonthlyComments', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('StudentId')->index();
            $table->integer('Status');
            $table->integer('Type')->nullable();
            $table->uuid('TeacherId')->nullable();
            $table->uuid('TeacherManagementId')->nullable();
            $table->uuid('SchoolYearId')->nullable();
            $table->date('Month');
            $table->uuid('ScriptReviewId')->nullable();
            $table->uuid('TeacherSentId')->nullable()->index();
            $table->uuid('MonthlyCommentId')->nullable()->index();
            $table->dateTime('SentTime')->nullable();
            $table->dateTime('ReportTime')->nullable();
            $table->dateTime('ConfirmationTime')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('study-program.MonthlyComments');
    }
}
