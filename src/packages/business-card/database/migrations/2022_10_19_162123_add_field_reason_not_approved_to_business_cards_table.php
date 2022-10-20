<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldReasonNotApprovedToBusinessCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('BusinessCards', function (Blueprint $table) {
            $table->string('ReasonNotApproved')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('BusinessCards', function (Blueprint $table) {
            $table->dropColumn('ReasonNotApproved');
        });
    }
}
