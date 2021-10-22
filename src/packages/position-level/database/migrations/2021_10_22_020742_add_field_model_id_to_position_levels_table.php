<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldModelIdToPositionLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('PositionLevels', function (Blueprint $table) {
            $table->uuid('ModelId')->nullable();
            $table->string('ModelType')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('PositionLevels', function (Blueprint $table) {
            $table->dropColumn('ModelId');
            $table->dropColumn('ModelType');
        });
    }
}
