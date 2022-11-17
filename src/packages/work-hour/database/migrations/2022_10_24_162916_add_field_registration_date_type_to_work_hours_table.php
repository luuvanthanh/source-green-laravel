<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldRegistrationDateTypeToWorkHoursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('WorkHours', function (Blueprint $table) {
            $table->string('RegistrationDateType')->nullable();
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
            $table->dropColumn('RegistrationDateType');
        });
    }
}
