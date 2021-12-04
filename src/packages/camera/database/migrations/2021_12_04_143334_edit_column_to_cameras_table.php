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
            $table->dropColumn('name')->nullable();
            $table->dropColumn('ip')->nullable();
            $table->dropColumn('port')->nullable();
            $table->dropColumn('user_name')->nullable();
            $table->dropColumn('password')->nullable();
            $table->dropColumn('video_source')->nullable();
            $table->dropColumn('is_recording')->default(false);
            $table->dropColumn('is_streaming')->default(false);
            $table->dropColumn('video_url')->nullable();
        });
    }
}
