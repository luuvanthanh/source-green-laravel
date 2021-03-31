<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbsentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('absents', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->bigInteger('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('SET NULL');
            $table->string('absent_type_id', 36);
            $table->foreign('absent_type_id')->references('id')->on('absent_types');
            $table->string('absent_reason_id', 36);
            $table->foreign('absent_reason_id')->references('id')->on('absent_reasons');
            $table->date('start_date');
            $table->date('end_date')->nullable();
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
        Schema::dropIfExists('absents');
    }
}
