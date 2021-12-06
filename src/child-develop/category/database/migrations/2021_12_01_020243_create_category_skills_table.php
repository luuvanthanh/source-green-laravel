<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategorySkillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CategorySkills', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Code');
            $table->string('Name');
            $table->boolean('Use')->default('false');
            $table->integer('NumericalSkill')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CategorySkills');
    }
}
