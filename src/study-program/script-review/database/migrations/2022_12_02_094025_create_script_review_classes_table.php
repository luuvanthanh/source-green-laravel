<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScriptReviewClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.ScriptReviewClasses', function (Blueprint $table) {
            $table->uuid('ScriptReviewId')->index();
            $table->uuid('ClassId')->index();
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
        Schema::dropIfExists('study-program.ScriptReviewClasses');
    }
}
