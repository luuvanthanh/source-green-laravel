<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTravelAgencieTourGuidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('travel_agencie_tour_guides', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->uuid('travel_agency_id');
            $table->foreign('travel_agency_id')->references('id')->on('travel_agencies')->onDelete('cascade');
            $table->uuid('tour_guide_id');
            $table->foreign('tour_guide_id')->references('id')->on('tour_guides')->onDelete('cascade');
            $table->date('date_of_entering_the_company');
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
        Schema::dropIfExists('travel_agencie_tour_guides');
    }
}
