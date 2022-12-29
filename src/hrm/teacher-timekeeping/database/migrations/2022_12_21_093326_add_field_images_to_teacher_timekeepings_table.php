<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldImagesToTeacherTimekeepingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TeacherTimekeepings', function (Blueprint $table) {
            $table->string('FileImage', 1000)->nullable();
            $table->string('Address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TeacherTimekeepings', function (Blueprint $table) {
            $table->dropColumn(['FileImage', 'Address']);
        });
    }
}
