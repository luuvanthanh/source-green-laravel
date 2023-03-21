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
                $table->uuid('BlockId')->nullable();
                $table->uuid('ProjectId')->nullable();
                $table->foreign('BlockId')->references('Id')->on('Blocks')->onDelete('cascade');
                $table->foreign('ProjectId')->references('Id')->on('distribution.ClassProjects')->onDelete('cascade');
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
