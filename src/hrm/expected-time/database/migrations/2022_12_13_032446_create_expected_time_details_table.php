<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpectedTimeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ExpectedTimeDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->integer('Type');
            $table->time('Time')->nullable();
            $table->uuid('TeachingShiftId');
            $table->boolean('IsActive')->default(false);
            $table->uuid('ExpectedTimeId')->index();
            $table->foreign('ExpectedTimeId')->references('Id')->on('ExpectedTimes')->onDelete('cascade');
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
        Schema::dropIfExists('ExpectedTimeDetails');
    }
}
