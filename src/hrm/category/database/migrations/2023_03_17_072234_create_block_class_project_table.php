<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlockClassProjectTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('BlockClassProjects')) {
            Schema::create('BlockClassProjects', function (Blueprint $table) {
                $table->uuid('Id')->index()->unique();
                $table->primary('Id');
                $table->uuid('BlockId')->nullable();
                $table->foreign('BlockId')->references('Id')->on('Blocks')->onDelete('cascade');
                $table->uuid('ProjectId')->nullable();
                $table->foreign('ProjectId')->references('Id')->on('distribution.ClassProjects')->onDelete('cascade');
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
        Schema::dropIfExists('BlockClassProjects');
    }
}
