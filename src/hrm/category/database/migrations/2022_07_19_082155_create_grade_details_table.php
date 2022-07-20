<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGradeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('GradeDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->uuid('CriteriaId');
            $table->integer('Level');
            $table->string('Description')->nullable();
            $table->uuid('GradeId')->index();
            $table->foreign('GradeId')->references('Id')->on('Grades')->onDelete('cascade');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('GradeDetails');
    }
}
