<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFiledCodeDetailToSkillGroupDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluate-teacher.SkillGroupDetails', function (Blueprint $table) {
            $table->string('Code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluate-teacher.SkillGroupDetails', function (Blueprint $table) {
            $table->dropColumn('Code');
        });
    }
}
