<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuarterReportDetailSubjectChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('study-program.QuarterReportDetailSubjectChildrens', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ScriptReviewSubjectDetailChildrenId');
            $table->uuid('EvaluationCriteriaId');
            $table->uuid('QuarterReportDetailSubjectId')->index();
            $table->foreign('QuarterReportDetailSubjectId')->references('Id')->on('study-program.QuarterReportDetailSubjects');
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
        Schema::dropIfExists('study-program.QuarterReportDetailSubjectChildrens');
    }
}
