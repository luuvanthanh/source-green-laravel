<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecruitmentLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('RecruitmentLevels')) {
            Schema::create('RecruitmentLevels', function (Blueprint $table) {
                $table->uuid('Id')->index()->unique();
                $table->primary('Id');
                $table->string('Code');
                $table->string('Name');
                $table->string('Decription');
                $table->longText('Note')->nullable();
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
        Schema::dropIfExists('RecruitmentLevels');
    }
}
