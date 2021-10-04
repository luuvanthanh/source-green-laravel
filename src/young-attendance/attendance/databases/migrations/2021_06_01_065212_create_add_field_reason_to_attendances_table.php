<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddFieldReasonToAttendancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Attendances', function (Blueprint $table) {
            $table->uuid('ReasonId')->nullable();
            $table->string('Reason')->nullable();
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
            $table->dropColumn('ReasonId');
            $table->dropColumn('Reason');
        });
    }
}
