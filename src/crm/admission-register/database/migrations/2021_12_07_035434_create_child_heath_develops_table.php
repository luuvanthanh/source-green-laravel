<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildHeathDevelopsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('child_heath_develops', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('sick')->nullable();
            $table->integer('year')->nullable();
            $table->string('hospital_time')->nullable();
            $table->string('status')->nullable();
            $table->uuid('medical_info_id')->nullable();
            $table->foreign('medical_info_id')->references('id')->on('medical_infos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('child_heath_develops');
    }
}
