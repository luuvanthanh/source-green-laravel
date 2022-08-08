<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldConversationIdFacebookToUserFacebookInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_facebook_infos', function (Blueprint $table) {
            $table->string('conversation_id_facebook')->nullable();
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
            $table->dropColumn('conversation_id_facebook');
        });
    }
}
