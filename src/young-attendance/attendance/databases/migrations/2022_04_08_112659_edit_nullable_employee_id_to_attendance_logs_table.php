<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditNullableEmployeeIdToAttendanceLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"AttendanceLogs"', function (Blueprint $table) {
            $table->uuid('"EmployeeId"')->nullable()->change();
        });
        Schema::table('AttendanceLogs', function (Blueprint $table) {
            $table->string('FileImage')->nullable();
            $table->string('Type')->default('HANDMADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('AttendanceLogs', function (Blueprint $table) {
            $table->dropColumn('FileImage');
            $table->dropColumn('Type');
        });
    }
}
