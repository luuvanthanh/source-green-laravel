<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldChildEvaluateCloverIdToChildEvaluatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('child_evaluates', function (Blueprint $table) {
            $table->uuid('child_evaluate_clover_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('child_evaluates', function (Blueprint $table) {
            $table->dropColumn('child_evaluate_clover_id');
        });
    }
}
