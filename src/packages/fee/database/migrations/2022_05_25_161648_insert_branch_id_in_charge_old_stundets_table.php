<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertBranchIdInChargeOldStundetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.ChargeOldStudents', function (Blueprint $table) {
            $table->uuid('BranchId')->nullable();
            $table->uuid('ClassTypeId')->nullable();
            $table->foreign('BranchId')->references('Id')->on('Branches')->onDelete('SET NULL');
            $table->foreign('ClassTypeId')->references('Id')->on('fee.ClassTypes')->onDelete('SET NULL');
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
            $table->dropColumn('BranchId', 'ClassTypeId');
        });
    }
}
