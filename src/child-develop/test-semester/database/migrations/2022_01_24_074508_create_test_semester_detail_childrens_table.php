<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestSemesterDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('TestSemesterDetailChildrens', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ChildEvaluateDetailId')->nullable();
            $table->uuid('ChildEvaluateDetailChildrenId');
            $table->uuid('TestSemesterDetailId');
            $table->foreign('TestSemesterDetailId')->references('Id')->on('TestSemesterDetails')->onDelete('cascade');
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
        Schema::dropIfExists('TestSemesterDetailChildrens');
    }
}
