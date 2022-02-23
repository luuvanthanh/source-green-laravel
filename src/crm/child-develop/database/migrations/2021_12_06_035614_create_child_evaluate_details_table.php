<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildEvaluateDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('child_evaluate_details', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('name_criteria');
            $table->boolean('input_assessment')->default('false');
            $table->boolean('periodic_assessment')->default('false');
            $table->boolean('use')->default('false');
            $table->uuid('child_evaluate_id');
            $table->foreign('child_evaluate_id')->references('id')->on('child_evaluates')->onDelete('cascade');
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
        Schema::dropIfExists('child_evaluate_details');
    }
}
