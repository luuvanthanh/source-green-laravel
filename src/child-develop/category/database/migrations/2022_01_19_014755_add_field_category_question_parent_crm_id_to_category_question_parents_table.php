<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCategoryQuestionParentCrmIdToCategoryQuestionParentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CategoryQuestionParents', function (Blueprint $table) {
            $table->uuid('CategoryQuestionParentCrmId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CategoryQuestionParents', function (Blueprint $table) {
            $table->dropColumn('CategoryQuestionParentCrmId');
        });
    }
}
