<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTuitionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.Tuitions', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ChargeStudentId');
            $table->foreign('ChargeStudentId')->references('Id')->on('fee.ChargeStudents')->onDelete('cascade');
            $table->uuid('FeeId');
            $table->foreign('FeeId')->references('Id')->on('fee.Fees');
            $table->uuid('PaymentFormId');
            $table->foreign('PaymentFormId')->references('Id')->on('fee.PaymentForms');
            $table->integer('Money');
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
        Schema::dropIfExists('fee.Tuitions');
    }
}
