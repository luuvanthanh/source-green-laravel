<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataMerketingTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_merketing_tags', function (Blueprint $table) {
            $table->uuid('data_marketing_id');
            $table->foreign('data_marketing_id')->references('id')->on('data_marketings')->onDelete('cascade');
            $table->uuid('tag_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_merketing_tags');
    }
}
