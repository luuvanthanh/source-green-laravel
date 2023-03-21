<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecruitmentConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('RecruitmentConfigurations')) {
            Schema::create('RecruitmentConfigurations', function (Blueprint $table) {
                $table->uuid('Id')->index()->unique();
                $table->primary('Id');
                $table->string('Code');
                $table->string('Name');
                $table->longText('Note')->nullable();
                $table->uuid('DivisionId');
                $table->foreign('DivisionId')->references('Id')->on('Divisions');
                $table->uuid('RecruitmentLevelId');
                $table->foreign('RecruitmentLevelId')->references('Id')->on('RecruitmentLevels');
                $table->timestamp('CreationTime', 0)->nullable();
                $table->timestamp('LastModificationTime', 0)->nullable();
            });
        }else {
            echo 'Table already exists';
            exit();
        }
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('RecruitmentConfigurations');
    }
}
