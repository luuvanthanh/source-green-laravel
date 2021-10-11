<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerPotentailTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_potentail_tags', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('tag_id');
            $table->uuid('customer_potentail_id');
            $table->foreign('customer_potentail_id')->references('id')->on('customer_potentails')->onDelete('cascade');
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
        Schema::dropIfExists('customer_potentail_tags');
    }
}
