<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldUseToChildEvaluatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ChildEvaluates', function (Blueprint $table) {
            $table->uuid('ChildEvaluateCrmId')->nullable();
            $table->boolean('Use')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ChildEvaluates', function (Blueprint $table) {
            $table->dropColumn('ChildEvaluateCrmId');
            $table->dropColumn('Use');
        });
    }
}
