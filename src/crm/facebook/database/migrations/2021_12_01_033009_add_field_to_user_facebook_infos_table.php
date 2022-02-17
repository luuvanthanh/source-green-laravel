<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToUserFacebookInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_facebook_infos', function (Blueprint $table) {
            $table->string('status')->default(0);
            $table->uuid('customer_lead_id')->nullable();
            $table->string('user_full_name')->nullable();
            $table->string('note')->nullable();
            $table->string('avatar')->nullable();
            $table->string('sex')->nullable();
            $table->uuid('employee_facebook_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_facebook_infos', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('customer_lead_id');
            $table->dropColumn('user_full_name');
            $table->dropColumn('note');
            $table->dropColumn('avatar');
            $table->dropColumn('sex');
            $table->dropColumn('employee_facebook_id');
        });
    }
}
