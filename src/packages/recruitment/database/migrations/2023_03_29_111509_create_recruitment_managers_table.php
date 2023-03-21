<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecruitmentManagersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('RecruitmentManagers', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Code');
            $table->string('Name');
            $table->date('StartDate');
            $table->date('EndDate');
            $table->integer('NumberOfRecruitments');
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions');
            $table->uuid('RecruitmentLevelId');
            $table->foreign('RecruitmentLevelId')->references('Id')->on('RecruitmentLevels');
            $table->uuid('RecruitmentConfigurationId');
            $table->foreign('RecruitmentConfigurationId')->references('Id')->on('RecruitmentConfigurations');
            $table->integer('NumberOfCandidates')->nullable();
            $table->integer('NumberOfCandidatesPass')->nullable();
            $table->string('Link')->nullable();
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
        Schema::dropIfExists('RecruitmentManagers');
    }
}
