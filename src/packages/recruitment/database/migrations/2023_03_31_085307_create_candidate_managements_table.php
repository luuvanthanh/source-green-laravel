<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidateManagementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CandidateManagements', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Name');
            $table->date('Date')->nullable();
            $table->string('Location');
            $table->string('Phone');
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions');
            $table->uuid('RecruitmentManagerId');
            $table->foreign('RecruitmentManagerId')->references('Id')->on('RecruitmentManagers');
            $table->uuid('RecruitmentLevelId');
            $table->foreign('RecruitmentLevelId')->references('Id')->on('RecruitmentLevels');
            $table->string('Status');
            $table->string('File');
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
        Schema::dropIfExists('CandidateManagements');
    }
}
