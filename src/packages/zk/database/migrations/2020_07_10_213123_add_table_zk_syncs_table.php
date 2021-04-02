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
            $table->string('subject_id', 36)->nullable();
            $table->longText('payload');
            $table->index(['subject_id', 'subject_type'], 'subject');
            $table->timestamps();
        });
        Schema::create('zk_device_sync_times', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('device_id', 36);
            $table->foreign('device_id')->references('id')->on('fingerprint_timekeepers')->onDelete('cascade');
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
