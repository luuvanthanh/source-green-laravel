<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnToCamerasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('ip')->nullable();
            $table->integer('port')->nullable();
            $table->string('user_name')->nullable();
            $table->string('password')->nullable();
            $table->string('video_source')->nullable();
            $table->boolean('is_recording')->default(false);
            $table->boolean('is_streaming')->default(false);
            $table->string('video_url')->nullable();
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
            $table->dropColumn('name');
            $table->dropColumn('ip');
            $table->dropColumn('port');
            $table->dropColumn('user_name');
            $table->dropColumn('password');
            $table->dropColumn('video_source');
            $table->dropColumn('is_recording');
            $table->dropColumn('is_streaming');
            $table->dropColumn('video_url');
        });
    }
}
