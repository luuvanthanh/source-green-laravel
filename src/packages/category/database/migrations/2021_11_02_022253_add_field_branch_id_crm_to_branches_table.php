<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldBranchIdCrmToBranchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Branches', function (Blueprint $table) {
            $table->uuid('BranchIdCrm')->nullable();
            $table->softDeletes('DeletedAt', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Branches', function (Blueprint $table) {
            $table->dropColumn('BranchIdCrm');
        });
    }
}
