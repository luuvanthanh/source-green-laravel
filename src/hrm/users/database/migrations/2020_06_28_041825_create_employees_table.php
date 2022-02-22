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
            $table->uuid('Id')->unique();
            $table->primary('Id');
            $table->string('FullName')->nullable();
            $table->date('DateOfBirth')->nullable();
            $table->date('PlaceOfBirth')->nullable();
            $table->string('Email')->nullable();
            $table->string('PhoneNumber')->nullable();
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
            $table->uuid('TrainingSchoolId')->nullable();
            $table->foreign('TrainingSchoolId')->references('Id')->on('TrainingSchools');
            $table->date('DateOff')->nullable();
            $table->date('Address')->nullable();
            $table->uuid('EducationalLevelId')->nullable();
            $table->foreign('EducationalLevelId')->references('Id')->on('EducationalLevels');
            $table->date('WorkDate')->nullable();
            $table->string('HealthInsuranceBookNumber')->nullable();
            $table->string('HospitalAddress')->nullable();
            $table->string('SocialInsuranceBooknumber')->nullable();
            $table->string('BankName')->nullable();
            $table->string('BankNumberOfAccount')->nullable();
            $table->string('Note')->nullable();
            $table->boolean('MaternityLeave')->default(false);
            $table->date('MaternityLeaveFrom')->nullable();
            $table->date('MaternityLeaveTo')->nullable();
            $table->integer('Status')->nullable();
            $table->integer('Category')->default(0);
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
