<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChargeStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.ChargeStudents', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('NameStudent');
            $table->uuid('SchoolYearId');
            $table->foreign('SchoolYearId')->references('Id')->on('fee.SchoolYears');
            $table->date('DateOfBirht');
            $table->integer('Age')->nullable();
            $table->date('DayAdmission');
            $table->uuid('ClassTypeId');
            $table->foreign('ClassTypeId')->references('Id')->on('fee.ClassTypes');
            $table->string('FatherName')->nullable();
            $table->string('FatherPhoneNumber')->nullable();
            $table->string('MotherName')->nullable();
            $table->string('MotherPhoneNumber')->nullable();
            $table->integer('TotalMoney')->nullable();
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
        Schema::dropIfExists('fee.ChargeStudents');
    }
}
