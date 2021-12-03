<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryQuestionParentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CategoryQuestionParents', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Question');
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
        Schema::dropIfExists('CategoryQuestionParents');
    }
}
