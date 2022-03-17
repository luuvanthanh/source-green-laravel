<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluateTypeSkillGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluate-teacher.EvaluateTypeSkillGroups', function (Blueprint $table) {
            $table->uuid('EvaluateTypeId');
            $table->foreign('EvaluateTypeId')->references('Id')->on('evaluate-teacher.EvaluateTypes')->onDelete('cascade');
            $table->uuid('SkillGroupId');
            $table->foreign('SkillGroupId')->references('Id')->on('evaluate-teacher.SkillGroups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluate-teacher.EvaluateTypeSkillGroups');
    }
}
