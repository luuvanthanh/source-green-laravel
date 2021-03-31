<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTableZkSyncsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('zk_syncs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('subject_type')->nullable();
            $table->string('action')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->longText('payload');
            $table->index(['subject_id', 'subject_type'], 'subject');
            $table->timestamps();
        });
        Schema::create('zk_device_sync_times', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('device_id');
            $table->bigInteger('zk_sync_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('zk_device_sync_times');
        Schema::dropIfExists('zk_syncs');
    }
}
