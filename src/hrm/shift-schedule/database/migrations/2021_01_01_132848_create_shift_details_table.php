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
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->time('StartTime');
            $table->time('EndTime');
            $table->uuid('ShiftId');
            $table->foreign('ShiftId')->references('Id')->on('Shifts')->onDelete('cascade');
            $table->string('Name')->nullable();
            $table->string('Code')->nullable();
            $table->time('AfterStart')->nullable();
            $table->time('BeforeEnd')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
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
