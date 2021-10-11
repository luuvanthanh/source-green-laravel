<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerPotentailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_potentails', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('code');
            $table->string('full_name');
            $table->date('birth_date');
            $table->string('sex');
            $table->string('email');
            $table->string('phone');
            $table->string('other_phone')->nullable();
            $table->string('address');
            $table->uuid('city_id');
            $table->uuid('district_id');
            $table->uuid('facility_id')->nullable();
            $table->uuid('employee_id')->nullable();
            $table->json('employee_info')->nullable();
            $table->uuid('user_create_id')->nullable();
            $table->json('user_create_info')->nullable();
            $table->uuid('search_source_id')->nullable();
            $table->string('facebook')->nullable();
            $table->string('zalo')->nullable();
            $table->string('instagram')->nullable();
            $table->string('skype')->nullable();
            $table->string('name_company')->nullable();
            $table->string('address_company')->nullable();
            $table->string('phone_company')->nullable();
            $table->string('career')->nullable();
            $table->string('file_image', 1000)->nullable();
            $table->uuid('customer_lead_id')->nullable();
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
        Schema::dropIfExists('customer_potentails');
    }
}
