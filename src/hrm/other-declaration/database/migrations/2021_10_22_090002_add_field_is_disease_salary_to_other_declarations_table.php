<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIsDiseaseSalaryToOtherDeclarationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('OtherDeclarations', function (Blueprint $table) {
            $table->boolean('IsDiseaseSalary')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('OtherDeclarations', function (Blueprint $table) {
            $table->dropColumn('IsDiseaseSalary');
        });
    }
}
