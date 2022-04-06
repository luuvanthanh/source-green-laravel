<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Bios', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('cascade');
            $table->string('Pin')->nullable();
            $table->string('No')->nullable();
            $table->string('Index')->nullable();
            $table->string('Valid')->nullable();
            $table->string('Duress')->nullable();
            $table->string('Type')->nullable();
            $table->string('MajorVer')->nullable();
            $table->string('MinorVer')->nullable();
            $table->string('Format')->nullable();
            $table->string('Tmp', 5000)->nullable();
            $table->timestamp('DeletedAt')->nullable();
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
        Schema::dropIfExists('Bios');
    }
}
