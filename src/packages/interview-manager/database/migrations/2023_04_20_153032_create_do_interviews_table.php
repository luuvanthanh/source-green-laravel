<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoInterviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DoInterviews', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Code');
            $table->string('InterviewName');
            $table->string('CandidateName');
            $table->string('Location');
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions')->onDelete('cascade');
            $table->string('File');
            $table->uuid('InterviewListId')->nullable();
            $table->foreign('InterviewListId')->references('Id')->on('InterviewLists')->onDelete('cascade');
            $table->uuid('InterviewConfigurationId');
            $table->foreign('InterviewConfigurationId')->references('Id')->on('InterviewConfigurations')->onDelete('cascade');
            $table->date('Date');
            $table->string('Time')->nullable();
            $table->string('Address');
            $table->string('Status')->nullable();
            $table->string('MediumScore')->nullable();
            $table->string('PointEvaluation')->nullable();
            $table->uuid('EmployeeId')->nullable();
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('cascade');
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
        Schema::dropIfExists('DoInterviews');
    }
}
