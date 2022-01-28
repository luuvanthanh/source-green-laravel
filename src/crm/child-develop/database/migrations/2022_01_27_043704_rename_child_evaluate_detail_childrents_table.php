<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameChildEvaluateDetailChildrentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('child_evaluate_detail_childrents')) {
            Schema::rename('child_evaluate_detail_childrents', 'child_evaluate_detail_childrens');
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('child_evaluate_detail_childrens')) {
            Schema::rename('child_evaluate_detail_childrens', 'child_evaluate_detail_childrents');
        }
    }
}
