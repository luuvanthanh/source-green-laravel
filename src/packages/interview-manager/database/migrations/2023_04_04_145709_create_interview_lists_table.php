<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInterviewListsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('InterviewLists', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('Code');
            $table->string('InterviewName');
            $table->string('CandidateName');
            $table->string('Location');
            $table->uuid('DivisionId');
            $table->foreign('DivisionId')->references('Id')->on('Divisions')->onDelete('cascade');
            $table->string('File');
            $table->uuid('InterviewConfigurationId');
            $table->foreign('InterviewConfigurationId')->references('Id')->on('InterviewConfigurations')->onDelete('cascade');
            $table->date('Date');
            $table->string('Time')->nullable();
            $table->string('Address');
            $table->string('Status')->nullable();
            $table->string('MediumScore')->nullable();
            $table->string('Result')->nullable();
            $table->string('SuggestedSalary')->nullable();
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
        Schema::dropIfExists('InterviewLists');
    }
}
