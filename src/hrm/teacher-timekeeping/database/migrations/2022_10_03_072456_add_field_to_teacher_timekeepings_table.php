<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToTeacherTimekeepingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TeacherTimekeepings', function (Blueprint $table) {
            $table->uuid('BranchId')->nullable();
            $table->uuid('ClassId')->nullable();
            $table->uuid('ClassProjectSessionId')->nullable();
            $table->uuid('ProductId')->nullable();
            $table->uuid('ModuleId')->nullable();
            $table->uuid('ProjectId')->nullable();
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
            $table->dropColumn(['BranchId', 'ClassId', 'ClassProjectSessionId', 'ProductId', 'ModuleId', 'ProjectId']);
        });
    }
}
