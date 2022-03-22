<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateHistoryCallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('history_calls', function (Blueprint $table) {
            $table->string('call_sid')->nullable()->change();
            $table->text('content')->nullable()->after('direction');
            $table->text('result')->nullable()->after('content');
            $table->text('refuse')->nullable()->after('result');
            $table->string('switchboard')->nullable();
            $table->uuid('employee_id')->nullable()->after('switchboard');
            $table->foreign('employee_id')->references('id')->on('employees');
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
            $table->dropColumn(['content', 'result', 'refuse', 'switchboard', 'employee_id']);
        });
    }
}
