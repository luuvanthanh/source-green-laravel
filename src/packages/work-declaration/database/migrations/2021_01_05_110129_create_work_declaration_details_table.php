<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkDeclarationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('work_declaration_details', function (Blueprint $table) {
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('work_declaration_id', 36);
            $table->foreign('work_declaration_id')->references('id')->on('work_declarations')->onDelete('cascade');
            $table->string('model_id', 36)->nullable();
            $table->string('model_type')->nullable();
            $table->string('reason')->nullable();
            $table->integer('work_number')->nullable();
            $table->date('month')->nullable();
            $table->json('time');
            $table->string('shift_id', 36)->nullable();
            $table->foreign('shift_id')->references('id')->on('shifts');
            $table->date('work_date')->nullable();
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
        Schema::dropIfExists('work_declaration_details');
    }
}
