<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldExperiencetoTypeTeachersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluate-teacher.TypeTeachers', function (Blueprint $table) {
            $table->text('Experience')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluate-teacher.TypeTeachers', function (Blueprint $table) {
            $table->dropColumn('Experience');
        });
    }
}
