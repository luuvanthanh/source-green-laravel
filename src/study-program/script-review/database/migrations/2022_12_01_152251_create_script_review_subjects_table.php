<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptReviewSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.ScriptReviewSubjects', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('SubjectId')->index();
            $table->uuid('ScriptReviewId')->index();
            $table->boolean('IsCheck')->default(false);
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
            $table->foreign('ScriptReviewId')->references('Id')->on('study-program.ScriptReviews')->onDelete('cascade');
            $table->foreign('SubjectId')->references('Id')->on('study-program.Subjects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('study-program.ScriptReviewSubjects');
    }
}
