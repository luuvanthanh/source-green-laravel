<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditFieldToBusinessCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('BusinessCardDetails', function (Blueprint $table) {
            $table->dropColumn('IsHalfTime');
        });

        Schema::table('BusinessCardDetails', function (Blueprint $table) {
            $table->boolean('IsFullDate')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
