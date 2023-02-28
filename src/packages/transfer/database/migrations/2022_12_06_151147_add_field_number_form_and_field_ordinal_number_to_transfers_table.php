<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldNumberFormAndFieldOrdinalNumberToTransfersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"Transfers"', function (Blueprint $table) {
            $table->string('DecisionNumber')->nullable()->change();
        });

        Schema::table('Transfers', function (Blueprint $table) {
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
        Schema::table('Transfers', function (Blueprint $table) {
            $table->dropColumn('OrdinalNumber', 'NumberForm');
        });
    }
}
