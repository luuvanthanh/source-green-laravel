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
        Schema::create('tuitions', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->uuid('charge_student_id');
            $table->uuid('fee_id');
            $table->uuid('payment_form_id');
            $table->unsignedDouble('money');
            $table->timestamps();

            $table->foreign('charge_student_id')->references('id')->on('charge_students')->onDelete('cascade');
            $table->foreign('fee_id')->references('id')->on('fees')->onDelete('cascade');
            $table->foreign('payment_form_id')->references('id')->on('payment_forms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tuitions');
    }
}
