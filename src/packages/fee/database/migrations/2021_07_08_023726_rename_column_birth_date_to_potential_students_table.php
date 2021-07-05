<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameColumnBirthDateToPotentialStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee."PotentialStudents"', function (Blueprint $table) {
            $table->renameColumn('"DateOfBirht"', '"DateOfBirth"');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee."PotentialStudents"', function (Blueprint $table) {
            $table->renameColumn('"DateOfBirht"', '"DateOfBirth"');
        });
    }
}
