<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParameterValueLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parameter_value_logs', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('parameter_value_id', 36);
            $table->foreign('parameter_value_id')->references('id')->on('parameter_values');
            $table->bigInteger('edit_user');
            $table->foreign('edit_user')->references('id')->on('users')->onDelete('SET NULL');
            $table->date('edit_date');
            $table->string('value_default')->nullable();
            $table->date('apply_date')->nullable();
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
        Schema::dropIfExists('parameter_value_logs');
    }
}
