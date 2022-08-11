<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTourGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tour_guides', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('full_name');
            $table->integer('sex')->default(0);
            $table->string('id_card')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->uuid('card_type_id')->nullable();
            $table->string('card_number')->nullable();
            $table->uuid('language_id')->nullable();
            $table->uuid('object_type_id')->nullable();
            $table->date('expiration_date')->nullable();
            $table->string('degree')->nullable();
            $table->string('professional_certificate')->nullable();
            $table->string('nationality')->nullable();
            $table->string('home_town')->nullable();
            $table->string('resident')->nullable();
            $table->string('note', 1000)->nullable();
            $table->integer('type')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tour_guides');
    }
}
