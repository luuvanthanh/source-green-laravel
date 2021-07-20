<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFixedParametersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.FixedParameters', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('PaymentFormId');
            $table->foreign('PaymentFormId')->references('Id')->on('fee.PaymentForms');
            $table->uuid('SchoolYearId');
            $table->foreign('SchoolYearId')->references('Id')->on('fee.SchoolYears')->onDelete('cascade');
            $table->date('DuaDate');
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
        Schema::dropIfExists('fee.FixedParameters');
    }
}
