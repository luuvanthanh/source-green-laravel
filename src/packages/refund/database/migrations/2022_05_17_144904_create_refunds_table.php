<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefundsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee.Refunds', function (Blueprint $table) {
            $table->uuid('Id')->primary();
            $table->uuid('SchoolYearId');
            $table->timestamp('CreationTime');
            $table->timestamp('LastModificationTime');
            $table->foreign('SchoolYearId')->references('Id')->on('fee.SchoolYears')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee.Refunds');
    }
}
