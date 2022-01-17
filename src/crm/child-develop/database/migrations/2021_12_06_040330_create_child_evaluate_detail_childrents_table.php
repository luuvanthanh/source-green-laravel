<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildEvaluateDetailChildrentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('child_evaluate_detail_childrents', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('content');
            $table->boolean('use')->default('false');
            $table->uuid('child_evaluate_detail_id');
            $table->foreign('child_evaluate_detail_id')->references('id')->on('child_evaluate_details')->onDelete('cascade');
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
        Schema::dropIfExists('child_evaluate_detail_childrents');
    }
}
