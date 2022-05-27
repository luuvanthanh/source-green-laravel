<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldClassIdInChargeOldStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->uuid('ClassId')->nullable();
            $table->foreign('ClassId')->references('Id')->on('origination.Classes')->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->dropColumn('ClassId');
        });
    }
}
