<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptReviewCommentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.ScriptReviewCommentDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('SampleCommentDetailId')->index();
            $table->uuid('ScriptReviewCommentId')->index();
            $table->boolean('IsCheck')->default(false);
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
            $table->foreign('ScriptReviewCommentId')->references('Id')->on('study-program.ScriptReviewComments')->onDelete('cascade');
            $table->foreign('SampleCommentDetailId')->references('Id')->on('study-program.SampleCommentDetails')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('study-program.ScriptReviewCommentDetails');
    }
}
