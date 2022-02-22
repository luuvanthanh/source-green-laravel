<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToWorkDeclarationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('WorkDeclarations', function (Blueprint $table) {
            $table->date('Date')->nullable();
            $table->time('Time')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('WorkDeclarations', function (Blueprint $table) {
            $table->dropColumn('Date');
            $table->dropColumn('Time');
        });
    }
}
