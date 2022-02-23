<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldContentInChildEvaluateDetailChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"ChildEvaluateDetailChildrens"', function (Blueprint $table) {
            $table->text('Content')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"ChildEvaluateDetailChildrens"', function (Blueprint $table) {
            $table->string('Content')->change();
        });
    }
}
