<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildEvaluateDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ChildEvaluateDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('NameCriteria');
            $table->boolean('InputAssessment')->default('false');
            $table->boolean('PeriodicAssessment')->default('false');
            $table->boolean('Use')->default('false');
            $table->uuid('ChildEvaluateId');
            $table->foreign('ChildEvaluateId')->references('Id')->on('ChildEvaluates')->onDelete('cascade');
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
        Schema::dropIfExists('ChildEvaluateDetails');
    }
}
