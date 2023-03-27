<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlockItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('BlockItems', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('BlockId')->nullable();
            $table->uuid('ItemId')->nullable();
            $table->string('Type')->nullable();
            $table->uuid('ParentId')->nullable();
            $table->integer('OrderIndex')->nullable();
            $table->foreign('BlockId')->references('Id')->on('Blocks')->onDelete('cascade');
            $table->foreign('ItemId')->references('Id')->on('common.Items')->onDelete('cascade');
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
        Schema::dropIfExists('BlockItems');
    }
}
