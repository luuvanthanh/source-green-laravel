<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeeExtensionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employee_extension', function (Blueprint $table) {
            $table->uuid('employee_id');
            $table->uuid('extension_id');

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('extension_id')->references('id')->on('extensions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employee_extension');
    }
}
