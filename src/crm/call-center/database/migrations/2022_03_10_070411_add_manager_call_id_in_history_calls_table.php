<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddManagerCallIdInHistoryCallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('history_calls', function (Blueprint $table) {
            $table->uuid('manager_call_id')->nullable();

            $table->foreign('manager_call_id')->references('id')->on('manager_calls')->onDelete('set Null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('history_calls', function (Blueprint $table) {
            $table->dropColumn('manager_call_id');
        });
    }
}
