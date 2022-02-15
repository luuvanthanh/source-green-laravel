<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldFeePolicieCrmIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.FeePolicies', function (Blueprint $table) {
            $table->uuid('FeePolicieCrmId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.FeePolicies', function (Blueprint $table) {
            $table->dropColumn('FeePolicieCrmId');
        });
    }
}
