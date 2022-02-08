<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameColumnnChildEvaluaInTestInputDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('test_input_detail_childrens', function (Blueprint $table) {
            $table->renameColumn('child_evalua_id', 'child_evaluate_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('test_input_detail_childrens', function (Blueprint $table) {
            $table->renameColumn('child_evaluate_id', 'child_evalua_id');
        });
    }
}
