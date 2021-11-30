<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnToNumberOfTouristsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('number_of_tourists', function (Blueprint $table) {
            $table->renameColumn('number_of_guest', 'number_of_guest_in');
            $table->integer('number_of_guest_out')->default(0);
        });
        Schema::table('number_of_tourists', function (Blueprint $table) {
            $table->integer('number_of_guest_in')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('number_of_tourists', function (Blueprint $table) {
            $table->renameColumn('number_of_guest_in', 'number_of_guest');
            $table->dropColumn('number_of_guest_out');
        });
    }
}
