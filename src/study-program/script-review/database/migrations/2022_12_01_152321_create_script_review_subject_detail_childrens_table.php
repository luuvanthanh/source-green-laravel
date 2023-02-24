<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptReviewSubjectDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.ScriptReviewSubjectDetailChildrens', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('SubjectSectionDetailId')->index();
            $table->uuid('ScriptReviewSubjectDetailId')->index();
            $table->boolean('IsCheck')->default(false);
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
            $table->foreign('ScriptReviewSubjectDetailId')->references('Id')->on('study-program.ScriptReviewSubjectDetails')->onDelete('cascade');
            $table->foreign('SubjectSectionDetailId')->references('Id')->on('study-program.SubjectSectionDetails')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('study-program.ScriptReviewSubjectDetailChildrens');
    }
}
