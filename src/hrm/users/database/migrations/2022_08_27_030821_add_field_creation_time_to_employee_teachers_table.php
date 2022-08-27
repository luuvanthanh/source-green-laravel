<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldCreationTimeToEmployeeTeachersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('EmployeeTypeTeacher', function (Blueprint $table) {
            $table->timestamp('CreationTime', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('EmployeeTypeTeacher', function (Blueprint $table) {
            $table->dropColumn('CreationTime');
        });
    }
}
