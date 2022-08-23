<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditFieldDateHoursContentCallResultCallToHistoryCaresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('history_cares', function (Blueprint $table) {
            $table->date('date')->nullable()->change();
            $table->time('hours')->nullable()->change();
            $table->renameColumn('content_call','content')->nullable()->change();
            $table->renameColumn('result_call','result')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('history_cares', function (Blueprint $table) {
            //
        });
    }
}
