<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldReciprToParameterFormulasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ParameterFormulas', function (Blueprint $table) {
            $table->dropColumn('Recipe');
        });
        Schema::table('ParameterFormulas', function (Blueprint $table) {
            $table->json('Recipe')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ParameterFormulas', function (Blueprint $table) {
            //
        });
    }
}
