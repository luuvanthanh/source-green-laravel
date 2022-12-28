<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonthlyCommentDetailSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.MonthlyCommentDetailSubjects', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ScriptReviewSubjectDetailId')->nullable();
            $table->string('Content')->nullable();
            $table->uuid('MonthlyCommentDetailId')->index();
            $table->foreign('MonthlyCommentDetailId')->references('Id')->on('study-program.MonthlyCommentDetails');
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
        Schema::dropIfExists('study-program.MonthlyCommentDetailSubjects');
    }
}
