<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldVmsCoreToCamerasTabel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->dropColumn('address_detail');
            $table->dropColumn('preset_id');
            $table->dropColumn('video_source');
            $table->dropColumn('video_url');
            $table->string('bit_rate')->nullable();
            $table->string('frame_rate')->nullable();
            $table->string('rtsp')->nullable();
            $table->string('resolution')->nullable();
            $table->string('profile')->nullable();
            $table->string('fps')->nullable();
            $table->string('gop')->nullable();
            $table->string('code_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->string('address_detail')->nullable();
            $table->string('preset_id')->nullable();
            $table->string('video_source')->nullable();
            $table->string('video_url')->nullable();
            $table->dropColumn('bit_rate');
            $table->dropColumn('frame_rate');
            $table->dropColumn('rtsp');
            $table->dropColumn('resolution');
            $table->dropColumn('profile');
            $table->dropColumn('fps');
            $table->dropColumn('gop');
            $table->dropColumn('code_id');
        });
    }
}
