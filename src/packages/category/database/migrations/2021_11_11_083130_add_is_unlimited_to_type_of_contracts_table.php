<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsUnlimitedToTypeOfContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('TypeOfContracts', function (Blueprint $table) {
            $table->boolean('IsUnlimited')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('TypeOfContracts', function (Blueprint $table) {
            $table->dropColumn('IsUnlimited');
        });
    }
}
