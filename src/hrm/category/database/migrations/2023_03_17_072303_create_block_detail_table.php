<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlockDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('BlockDetails')) {
            Schema::create('BlockDetails', function (Blueprint $table) {
                $table->uuid('Id')->index()->unique();
                $table->primary('Id');
                $table->uuid('BlockId')->nullable();
                $table->foreign('BlockId')->references('Id')->on('Blocks')->onDelete('cascade');
                $table->string('Name')->nullable();
                $table->timestamp('CreationTime', 0)->nullable();
                $table->timestamp('LastModificationTime', 0)->nullable();
                $table->softDeletes('DeletionTime', 0);
            });
        }else {
            echo 'Table already exists';
            exit();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('BlockDetails');
    }
}
