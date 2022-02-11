<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_forms', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->string('code');
            $table->string('name');
            $table->boolean('is_semester')->default(false);
            $table->string('type');
            $table->uuid('payment_form_clover_id')->nullable();
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
        Schema::dropIfExists('payment_forms');
    }
}
