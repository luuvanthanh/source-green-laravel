<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameCategoryQuestionParentIdToChildIssuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"child_issues"', function (Blueprint $table) {
            $table->renameColumn('"category-question-parent_id"', '"category_question_parent_id"');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"child_issues"', function (Blueprint $table) {
            $table->renameColumn('"category_question_parent_id"', '"category-question-parent_id"');
        });
    }
}
