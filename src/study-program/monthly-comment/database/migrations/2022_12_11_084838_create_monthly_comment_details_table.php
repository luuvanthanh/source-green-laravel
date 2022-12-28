<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonthlyCommentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.MonthlyCommentDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->text('Content')->nullable();
            $table->boolean('IsSubject')->default(false);
            $table->boolean('IsComment')->default(false);
            $table->uuid('ScriptReviewSubjectId')->nullable()->index();
            $table->uuid('ScriptReviewCommentId')->nullable()->index();
            $table->uuid('MonthlyCommentId')->index();
            $table->foreign('MonthlyCommentId')->references('Id')->on('study-program.MonthlyComments');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('study-program.MonthlyCommentDetails');
    }
}
