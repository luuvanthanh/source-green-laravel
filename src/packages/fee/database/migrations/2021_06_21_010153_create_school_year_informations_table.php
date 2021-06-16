<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchoolYearInformationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.SchoolYearInformations', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('FeePoliceId');
            $table->foreign('FeePoliceId')->references('Id')->on('fee.FeePolicies')->onDelete('cascade');
            $table->date('Schedule');
            $table->uuid('PaymentFormId');
            $table->foreign('PaymentFormId')->references('Id')->on('fee.PaymentForms')->onDelete('cascade');
            $table->integer('SchoolDay');
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
        Schema::dropIfExists('fee.SchoolYearInformations');
    }
}
