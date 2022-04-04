<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildEvaluateDetailChildrentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ChildEvaluateDetailChildrents', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Content');
            $table->boolean('Use')->default('false');
            $table->uuid('ChildEvaluateDetailId');
            $table->foreign('ChildEvaluateDetailId')->references('Id')->on('ChildEvaluateDetails')->onDelete('cascade');
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
        Schema::dropIfExists('ChildEvaluateDetailChildrents');
    }
}
