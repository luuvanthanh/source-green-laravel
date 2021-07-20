<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.FeeDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('FeePoliceId');
            $table->foreign('FeePoliceId')->references('Id')->on('fee.FeePolicies')->onDelete('cascade');
            $table->uuid('ClassTypeId');
            $table->foreign('ClassTypeId')->references('Id')->on('fee.ClassTypes')->onDelete('cascade');
            $table->uuid('PaymentFormId');
            $table->foreign('PaymentFormId')->references('Id')->on('fee.PaymentForms')->onDelete('cascade');
            $table->string('Content');
            $table->date('ApplyStartTime');
            $table->date('ApplyEndTime');
            $table->integer('OldStudent');
            $table->integer('NewStudent');
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
        Schema::dropIfExists('fee.FeeDetails');
    }
}
