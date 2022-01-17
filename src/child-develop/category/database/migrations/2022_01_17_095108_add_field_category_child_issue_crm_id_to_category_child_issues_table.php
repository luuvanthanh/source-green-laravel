<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCategoryChildIssueCrmIdToCategoryChildIssuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CategoryChildIssues', function (Blueprint $table) {
            $table->uuid('CategoryChildIssueCrmId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CategoryChildIssues', function (Blueprint $table) {
            $table->dropColumn('CategoryChildIssueCrmId');
        });
    }
}
