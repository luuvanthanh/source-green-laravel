<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldStatusToAbsentStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('AbsentStudents', function (Blueprint $table) {
            $table->string('Status')->default('CONFIRM');
            $table->string('EmployeeId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('AbsentStudents', function (Blueprint $table) {
            $table->dropColumn('EmployeeId');
            $table->dropColumn('Status');
        });
    }
}
