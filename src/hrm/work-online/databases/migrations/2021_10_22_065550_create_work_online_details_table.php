<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkOnlineDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('WorkOnlineDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->date('Date');
            $table->time('StartTime')->nullable();
            $table->time('EndTime')->nullable();
            $table->string('ShiftCode')->nullable();
            $table->float('TotalHour')->nullable();
            $table->boolean('IsFullDate')->default(true);
            $table->uuid('WorkOnlineId');
            $table->foreign('WorkOnlineId')->references('Id')->on('WorkOnlines')->onDelete('cascade');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletedAt', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('WorkOnlineDetails');
    }
}
