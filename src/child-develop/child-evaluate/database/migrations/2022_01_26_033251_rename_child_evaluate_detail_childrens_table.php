<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameChildEvaluateDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('ChildEvaluateDetailChildrents')) {
            Schema::rename('ChildEvaluateDetailChildrents', 'ChildEvaluateDetailChildrens');
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('ChildEvaluateDetailChildrens')) {
            Schema::rename('ChildEvaluateDetailChildrens', 'ChildEvaluateDetailChildrents');
        }
    }
}
