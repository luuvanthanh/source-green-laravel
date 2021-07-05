<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePotentialStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.PotentialStudents', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('NameStudent');
            $table->date('DateOfBirht');
            $table->integer('Age')->nullable();
            $table->date('DayAdmission');
            $table->string('FatherName')->nullable();
            $table->string('FatherPhoneNumber')->nullable();
            $table->string('MotherName')->nullable();
            $table->string('MotherPhoneNumber')->nullable();
            $table->integer('Status')->default(1);
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
        Schema::dropIfExists('fee.PotentialStudents');
    }
}
