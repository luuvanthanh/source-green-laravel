<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTravelAgenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('travel_agencies', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('name');
            $table->string('representative_name')->nullable();
            $table->string('representative_phone')->nullable();
            $table->string('english_name')->nullable();
            $table->integer('number_of_seasonal_worker')->nullable();
            $table->string('travel_permit')->nullable();
            $table->string('account_name')->nullable();
            $table->integer('service_type')->nullable();
            $table->date('license_date')->nullable();
            $table->string('phone')->nullable();
            $table->string('status')->nullable();
            $table->string('operator_name')->nullable();
            $table->string('operator_phone')->nullable();
            $table->string('address')->nullable();
            $table->string('license_number')->nullable();
            $table->string('email')->nullable();
            $table->date('date_range')->nullable();
            $table->string('reporter_name')->nullable();
            $table->string('reporter_phone')->nullable();
            $table->string('fax')->nullable();
            $table->string('exploiting_international_visitor_market')->nullable();
            $table->string('website')->nullable();
            $table->string('number_of_regular_employee')->nullable();
            $table->string('total_number_of_registered_vehicle')->nullable();
            $table->integer('locality')->nullable();
            $table->string('tax_code')->nullable();
            $table->string('note')->nullable();
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
        Schema::dropIfExists('travel_agencies');
    }
}
