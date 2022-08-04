<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpectedToCollectMoneysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.ExpectedToCollectMoneys', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->string('Name');
            $table->float('Money');
            $table->uuid('FeeId');
            $table->date('Month');
            $table->uuid('StudentId')->nullable();
            $table->uuid('ChargeOldStudentId')->index()->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->foreign('ChargeOldStudentId')->references('Id')->on('fee.ChargeOldStudents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee.ExpectedToCollectMoneys');
    }
}
