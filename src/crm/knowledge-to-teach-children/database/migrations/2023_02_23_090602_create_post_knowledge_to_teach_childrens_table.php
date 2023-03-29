<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostKnowledgeToTeachChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_knowledge_to_teach_childrens', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('name');
            $table->uuid('category_knowledge_to_teach_children_id');
            $table->foreign('category_knowledge_to_teach_children_id')->references('id')->on('category_knowledge_to_teach_childrens')->onDelete('cascade');
            $table->string('image')->nullable();
            $table->longText('content')->nullable();
            $table->uuid('employee_id');
            $table->string('status');
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
        Schema::dropIfExists('post_knowledge_to_teach_childrens');
    }
}
