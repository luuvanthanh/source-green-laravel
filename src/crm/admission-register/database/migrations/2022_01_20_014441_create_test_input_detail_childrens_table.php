<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestInputDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('test_input_detail_childrens', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('child_evaluate_detail_childrent_id')->nullable();
            $table->uuid('child_evaluate_detail_id')->nullable();
            $table->uuid('test_input_detail_id');
            $table->foreign('test_input_detail_id')->references('id')->on('test_input_details')->onDelete('cascade');
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
        Schema::dropIfExists('test_input_detail_childrens');
    }
}
