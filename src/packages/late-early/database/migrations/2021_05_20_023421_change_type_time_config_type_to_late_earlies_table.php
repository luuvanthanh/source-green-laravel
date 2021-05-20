<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeTimeConfigTypeToLateEarliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('LateEarlies', function (Blueprint $table) {
            $table->dropColumn('TimeConfigType');
        });

        Schema::table('LateEarlies', function (Blueprint $table) {
            $table->uuid('TimeConfigType')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
