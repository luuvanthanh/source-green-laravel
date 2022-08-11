<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUnitIdToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('unit_id')->nullable();
            $table->boolean('is_all_tourist_destination')->default(false);
            $table->boolean('is_all_camera')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('unit_id');
            $table->dropColumn('is_all_tourist_destination');
            $table->dropColumn('is_all_camera');
        });
    }
}
