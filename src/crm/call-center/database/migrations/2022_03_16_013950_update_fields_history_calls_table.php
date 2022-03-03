<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldsHistoryCallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('history_calls', function (Blueprint $table) {
            $table->renameColumn('call_sid', 'call_id_sub');
            $table->uuid('call_id_parent')->nullable()->after('');
            $table->uuid('call_id_main');

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
            $table->renameColumn('call_id_sub', 'call_sid');
            $table->dropColumn('call_id_parent', 'call_id_main');
        });
    }
}
