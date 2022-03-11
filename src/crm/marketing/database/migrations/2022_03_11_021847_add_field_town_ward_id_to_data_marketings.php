<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldTownWardIdToDataMarketings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('data_marketings', function (Blueprint $table) {
            $table->uuid('town_ward_id')->nullable();
            $table->string('user_facebook_id')->nullable();
            $table->uuid('category_relationship_id')->nullable();
            $table->date('birth_date')->nullable()->change();
            $table->string('sex')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('phone')->nullable()->change();
            $table->string('address')->nullable()->change();
            $table->uuid('city_id')->nullable()->change();
            $table->uuid('district_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('data_marketings', function (Blueprint $table) {
            $table->dropColumn('town_ward_id');
            $table->dropColumn('user_facebook_id');
        });
    }
}
