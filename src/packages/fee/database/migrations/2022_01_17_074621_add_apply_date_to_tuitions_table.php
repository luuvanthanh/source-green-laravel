<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddApplyDateToTuitionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.OldStudentTuitions', function (Blueprint $table) {
            $table->date('ApplyDate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.OldStudentTuitions', function (Blueprint $table) {
            $table->dropColumn('ApplyDate');
        });
    }
}
