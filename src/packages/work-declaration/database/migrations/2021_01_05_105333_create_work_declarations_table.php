<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkDeclarationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('WorkDeclarations', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('EmployeeId', 36);
            $table->foreign('EmployeeId')->references('id')->on('Employees')->onDelete('SET NULL');
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
        Schema::dropIfExists('WorkDeclarations');
    }
}
