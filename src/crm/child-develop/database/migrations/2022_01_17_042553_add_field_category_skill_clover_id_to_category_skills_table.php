<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCategorySkillCloverIdToCategorySkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('category_skills', function (Blueprint $table) {
            $table->uuid('category_skill_clover_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('category_skills', function (Blueprint $table) {
            $table->dropColumn('category_skill_clover_id');
        });
    }
}
