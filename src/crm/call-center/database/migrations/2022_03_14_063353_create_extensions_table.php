<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExtensionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('extensions', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->string('password');
            $table->string('domain');
            $table->string('caller');
            $table->unsignedInteger('id_cmc');
            $table->unsignedInteger('phone_id_cmc')->nullable();
            $table->string('phone_number')->nullable();
            $table->unsignedInteger('state');
            $table->unsignedInteger('user_id_cmc');

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
        Schema::dropIfExists('extensions');
    }
}
