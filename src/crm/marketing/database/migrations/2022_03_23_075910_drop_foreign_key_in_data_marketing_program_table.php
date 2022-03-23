<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropForeignKeyInDataMarketingProgramTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('data_marketing_program', function (Blueprint $table) {
            $table->dropForeign(['data_marketing_id']);
            $table->dropForeign(['marketing_program_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('data_marketing_program', function (Blueprint $table) {
            //
        });
    }
}
