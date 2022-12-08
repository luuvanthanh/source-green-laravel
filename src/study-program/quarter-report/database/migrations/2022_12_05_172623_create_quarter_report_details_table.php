<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuarterReportDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.QuarterReportDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->boolean('IsSubject')->default(false);
            $table->boolean('IsComment')->default(false);
            $table->uuid('ScriptReviewSubjectId')->nullable();
            $table->uuid('ScriptReviewCommentId')->nullable();
            $table->text('Content')->nullable();
            $table->uuid('QuarterReportId')->index();
            $table->foreign('QuarterReportId')->references('Id')->on('study-program.QuarterReports');
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
        Schema::dropIfExists('study-program.QuarterReportDetails');
    }
}
