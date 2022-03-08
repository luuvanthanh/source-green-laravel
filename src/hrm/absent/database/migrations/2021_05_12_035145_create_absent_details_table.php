<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbsentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('AbsentDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('AbsentId');
            $table->foreign('AbsentId')->references('Id')->on('Absents')->onDelete('cascade');
            $table->date('Date');
            $table->boolean('IsFullDate')->default(true);
            $table->string('ShiftCode')->nullable();
            $table->time('StartTime')->nullable();
            $table->time('EndTime')->nullable();
            $table->uuid('ShiftId')->nullable();
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
        Schema::dropIfExists('AbsentDetails');
    }
}
