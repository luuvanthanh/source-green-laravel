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
        Schema::create('ZkSyncs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('SubjectType')->nullable();
            $table->string('Action')->nullable();
            $table->string('SubjectId', 36)->nullable();
            $table->longText('Payload');
            $table->index(['SubjectId', 'SubjectType'], 'Subject');
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
        });
        Schema::create('ZkDeviceSyncTimes', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('DeviceId', 36);
            $table->foreign('DeviceId')->references('id')->on('FingerprintTimekeepers')->onDelete('cascade');
            $table->bigInteger('ZkSyncId')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ZkDeviceSyncTimes');
        Schema::dropIfExists('ZkSyncs');
    }
}
