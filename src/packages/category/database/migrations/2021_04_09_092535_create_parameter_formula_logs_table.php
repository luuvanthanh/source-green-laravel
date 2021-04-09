<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParameterFormulaLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parameter_formula_logs', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('parameter_formula_id', 36);
            $table->foreign('parameter_formula_id')->references('id')->on('parameter_formulas');
            $table->bigInteger('edit_user');
            $table->foreign('edit_user')->references('id')->on('users')->onDelete('SET NULL');
            $table->date('edit_date');
            $table->string('name');
            $table->date('apply_date')->nullable();
            $table->string('recipe')->nullable();
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
        Schema::dropIfExists('parameter_formula_logs');
    }
}
