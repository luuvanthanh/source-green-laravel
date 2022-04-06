<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetailPaymentAccountantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.DetailPaymentAccountants', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('ChargeOldStudentId');
            $table->foreign('ChargeOldStudentId')->references('Id')->on('fee.ChargeOldStudents')->onDelete('cascade');
            $table->uuid('FeeId');
            $table->integer('Money');
            $table->date('Month');
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
        Schema::dropIfExists('fee.DetailPaymentAccountants');
    }
}
