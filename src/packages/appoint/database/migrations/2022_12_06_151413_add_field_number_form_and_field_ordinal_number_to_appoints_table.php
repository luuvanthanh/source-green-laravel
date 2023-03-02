<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldNumberFormAndFieldOrdinalNumberToAppointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"Appoints"', function (Blueprint $table) {
            $table->string('DecisionNumber')->nullable()->change();
        });

        Schema::table('Appoints', function (Blueprint $table) {
            $table->string('OrdinalNumber')->nullable();
            $table->string('NumberForm')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Appoints', function (Blueprint $table) {
            $table->dropColumn('OrdinalNumber', 'NumberForm');
        });
    }
}
