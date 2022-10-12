<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToChildEvaluateDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ChildEvaluateDetailChildrens', function (Blueprint $table) {
            $table->float('Score')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ChildEvaluateDetailChildrens', function (Blueprint $table) {
            $table->dropColumn('Score');
        });
    }
}
