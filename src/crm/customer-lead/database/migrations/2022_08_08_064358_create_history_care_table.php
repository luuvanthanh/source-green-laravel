<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoryCareTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('history_cares', function (Blueprint $table) {
            $table->uuid('id')->index();
            $table->primary('id');
            $table->uuid('customer_lead_id');
            $table->integer('quantity_care');
            $table->integer('status')->nullable();
            $table->date('date');
            $table->time('hours');
            $table->text('content_call')->nullable();
            $table->text('result_call')->nullable();
            $table->string('history_interactive')->nullable();
            $table->string('offline')->nullable();
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
        Schema::dropIfExists('history_cares');
    }
}
