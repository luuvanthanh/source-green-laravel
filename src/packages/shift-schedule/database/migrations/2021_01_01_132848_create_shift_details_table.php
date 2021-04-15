<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShiftDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ShiftDetails', function (Blueprint $table) {
            $table->string('Id', 36)->index()->unique();
            $table->primary('Id');
            $table->time('StartTime');
            $table->time('EndTime');
            $table->string('ShiftId', 36);
            $table->foreign('ShiftId')->references('Id')->on('Shifts')->onDelete('cascade');
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
        Schema::dropIfExists('ShiftDetails');
    }
}
