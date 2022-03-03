<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCloverIdToChildEvaluateDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('child_evaluate_details', function (Blueprint $table) {
            $table->uuid('child_evaluate_detail_clover_id')->nullable();
        });

        Schema::table('child_evaluate_detail_childrens', function (Blueprint $table) {
            $table->uuid('child_evaluate_detail_children_clover_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('child_evaluate_details', function (Blueprint $table) {
            $table->dropColumn('child_evaluate_detail_clover_id');
        });

        Schema::table('child_evaluate_detail_childrens', function (Blueprint $table) {
            $table->dropColumn('child_evaluate_detail_children_clover_id');
        });
    }
}
