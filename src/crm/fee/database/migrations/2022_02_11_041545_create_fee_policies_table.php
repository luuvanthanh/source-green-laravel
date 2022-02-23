<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeePoliciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_policies', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->date('decision_date');
            $table->string('decision_number', 20);
            $table->uuid('school_year_id');
            $table->uuid('fee_policie_clover_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('school_year_id')->references('id')->on('school_years')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fee_policies');
    }
}
