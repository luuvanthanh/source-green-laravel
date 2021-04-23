<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusinessCardDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('BusinessCardDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('BusinessCardId');
            $table->foreign('BusinessCardId')->references('Id')->on('BusinessCards')->onDelete('cascade');
            $table->date('Date')->nullable();
            $table->boolean('IsHalfTime')->default(false);
            $table->float('Number')->nullable();
            $table->time('StartTime')->nullable();
            $table->time('EndTime')->nullable();
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
        Schema::dropIfExists('BusinessCardDetails');
    }
}
