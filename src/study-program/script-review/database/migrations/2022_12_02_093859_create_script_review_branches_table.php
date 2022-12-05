<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptReviewBranchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.ScriptReviewBranches', function (Blueprint $table) {
            $table->uuid('ScriptReviewId')->index();
            $table->uuid('BranchId')->index();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->foreign('ScriptReviewId')->references('Id')->on('study-program.ScriptReviews')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('study-program.ScriptReviewBranches');
    }
}
