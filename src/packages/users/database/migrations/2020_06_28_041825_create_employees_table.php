<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Employees', function (Blueprint $table) {
            $table->bigIncrements("FingerprintId");
            $table->dropPrimary("Employees_FingerprintId_primary");
            $table->string('id', 36)->unique();
            $table->primary('id');
            $table->string('FullName')->nullable();
            $table->date('DateOfBirth')->nullable();
            $table->date('PlaceOfBirth')->nullable();
            $table->date('Email')->nullable();
            $table->date('PhoneNumber')->nullable();
            $table->string('Code');
            $table->string('PermanentAddress')->nullable();
            $table->string('Nationality')->nullable();
            $table->string('Nation')->nullable();
            $table->string('IdCard')->nullable();
            $table->string('DateOfIssueIdCard')->nullable();
            $table->string('PlaceOfIssueIdCard')->nullable();
            $table->string('Religion')->nullable();
            $table->string('Gender')->nullable();
            $table->string('TaxCode')->nullable();
            $table->string('DegreeId', 36)->nullable();
            $table->foreign('DegreeId')->references('id')->on('Degrees');
            $table->string('TrainingMajorId', 36)->nullable();
            $table->foreign('TrainingMajorId')->references('id')->on('TrainingMajors');
            $table->string('TrainingSchoolId', 36)->nullable();
            $table->foreign('TrainingSchoolId')->references('id')->on('TrainingSchools');
            $table->date('DateOff')->nullable();
            $table->date('Address')->nullable();
            $table->string('EducationalLevelId', 36)->nullable();
            $table->foreign('EducationalLevelId')->references('id')->on('EducationalLevels');
            $table->date('WorkDate')->nullable();
            $table->string('HealthInsuranceBookNumber')->nullable();
            $table->string('HospitalAdress')->nullable();
            $table->string('SocialInsuranceBooknumber')->nullable();
            $table->string('BankName')->nullable();
            $table->string('BankNumberOfAccount')->nullable();
            $table->string('Note')->nullable();
            $table->boolean('MaternityLeave')->default(false);
            $table->date('MaternityLeaveFrom')->nullable();
            $table->date('MaternityLeaveTo')->nullable();
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
        Schema::dropIfExists('Employees');
    }
}
