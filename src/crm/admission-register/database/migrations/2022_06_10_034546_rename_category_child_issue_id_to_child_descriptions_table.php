<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameCategoryChildIssueIdToChildDescriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('child_descriptions', function (Blueprint $table) {
            $table->renameColumn('"category-child-issue_id"', '"category_child_issue_id"');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('child_descriptions', function (Blueprint $table) {
            $table->renameColumn('"category_child_issue_id"', '"category-child-issue_id"');
        });
    }
}
