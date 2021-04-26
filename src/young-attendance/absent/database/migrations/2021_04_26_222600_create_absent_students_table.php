<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbsentStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('AbsentStudents', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ParentId');
            $table->uuid('StudentId');
            $table->uuid('AbsentTypeId');
            $table->foreign('AbsentTypeId')->references('Id')->on('AbsentTypeStudents');
            $table->uuid('AbsentReasonId');
            $table->foreign('AbsentReasonId')->references('Id')->on('AbsentReasonStudents');
            $table->date('StartDate');
            $table->date('EndDate')->nullable();
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
        Schema::dropIfExists('AbsentStudents');
    }
}
