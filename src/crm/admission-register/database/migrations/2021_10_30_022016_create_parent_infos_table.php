<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParentInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parent_infos', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('full_name');
            $table->date('birth_date');
            $table->string('sex');
            $table->string('email');
            $table->string('phone');
            $table->string('other_phone')->nullable();
            $table->string('address')->nullable();
            $table->uuid('city_id')->nullable();
            $table->uuid('district_id')->nullable();
            $table->string('facebook')->nullable();
            $table->string('zalo')->nullable();
            $table->string('instagram')->nullable();
            $table->string('skype')->nullable();
            $table->string('name_company')->nullable();
            $table->string('address_company')->nullable();
            $table->string('phone_company')->nullable();
            $table->string('career')->nullable();
            $table->string('file_image', 1000)->nullable();
            $table->boolean('status')->default(false);
            $table->uuid('customer_lead_id')->nullable();
            $table->uuid('admission_register_id');
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
        Schema::dropIfExists('parent_infos');
    }
}
