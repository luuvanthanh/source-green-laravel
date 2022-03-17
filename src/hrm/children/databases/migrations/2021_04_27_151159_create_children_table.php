<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildrenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Childrens', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('EmployeeId');
            // $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->string('FullName');
            $table->date('Birthday');
            $table->string('Status')->default('ON');
            $table->string('Gender')->nullable();
            $table->string('Relationship')->nullable();
            $table->boolean('IsDependentPerson')->default(false);
            $table->string('TaxCode')->nullable();
            $table->date('DedectionTimeFrom')->nullable();
            $table->date('DedectionTimeTo')->nullable();
            $table->string('FileImage', 1000)->nullable();
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
        Schema::dropIfExists('Childrens');
    }
}
