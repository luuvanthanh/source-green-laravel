<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCategoryQuestionParentCloverIdToCategoryQuestionParentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('category_question_parents', function (Blueprint $table) {
            $table->uuid('category_question_parent_clover_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('category_question_parents', function (Blueprint $table) {
            $table->dropColumn('category_question_parent_clover_id');
        });
    }
}
