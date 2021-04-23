<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnToWorkHoursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('WorkHours', function (Blueprint $table) {
            $table->uuid('AbsentTypeId')->nullable();
            $table->foreign('AbsentTypeId')->references('Id')->on('AbsentTypes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('WorkHours', function (Blueprint $table) {
            $table->dropPrimary('WorkHours_AbsentTypeId_primary');
            $table->dropColumn('AbsentTypeId');
        });
    }
}
