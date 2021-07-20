<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChangeParameterDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.ChangeParameterDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ChangeParameterId');
            $table->foreign('ChangeParameterId')->references('Id')->on('fee.ChangeParameters')->onDelete('cascade');
            $table->date('Date');
            $table->date('DuaDate');
            $table->integer('ActualWeek');
            $table->date('StartDate');
            $table->date('EndDate');
            $table->uuid('PaymentFormId');
            $table->foreign('PaymentFormId')->references('Id')->on('fee.PaymentForms');
            $table->integer('FullMonth');
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
        Schema::dropIfExists('fee.ChangeParameterDetails');
    }
}
