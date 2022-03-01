<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldUseToStatusParentPotentialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('status_parent_potentials', function (Blueprint $table) {
            $table->boolean('use')->default(false);
            $table->boolean('status_hard')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('status_parent_potentials', function (Blueprint $table) {
            $table->dropColumn('use');
            $table->dropColumn('status_hard');
        });
    }
}
