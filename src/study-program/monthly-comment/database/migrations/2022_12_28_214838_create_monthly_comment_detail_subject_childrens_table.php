<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonthlyCommentDetailSubjectChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.MonthlyCommentDetailSubjectChildrens', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Content')->nullable();
            $table->string('ContentAnswer')->nullable();
            $table->uuid('ScriptReviewSubjectDetailChildrenId')->nullable();
            $table->uuid('EvaluationCriteriaId')->nullable();
            $table->uuid('MonthlyCommentDetailSubjectId')->index();
            $table->foreign('MonthlyCommentDetailSubjectId')->references('Id')->on('study-program.MonthlyCommentDetailSubjects')->onDelete('cascade');;
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
        Schema::dropIfExists('study-program.MonthlyCommentDetailSubjectChildrens');
    }
}
