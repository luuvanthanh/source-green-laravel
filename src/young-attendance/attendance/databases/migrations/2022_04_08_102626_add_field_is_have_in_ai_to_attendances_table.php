<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIsHaveInAiToAttendancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Attendances', function (Blueprint $table) {
            $table->boolean('IsHaveInAi')->default(false);
            $table->boolean('IsHaveOutAi')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Attendances', function (Blueprint $table) {
            $table->dropColumn('IsHaveInAi');
            $table->dropColumn('IsHaveOutAi');
        });
    }
}
