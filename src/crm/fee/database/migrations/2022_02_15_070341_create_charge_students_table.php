<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChargeStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('charge_students', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->string('name_student')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->integer('age')->nullable();
            $table->string('father_name')->nullable();
            $table->string('father_phone')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('mother_phone')->nullable();
            $table->date('day_admission');
            $table->uuid('student_info_id')->nullable();
            $table->uuid('school_year_id');
            $table->uuid('class_type_id');
            $table->unsignedDouble('total_money')->nullable();
            $table->timestamps();

            $table->foreign('student_info_id')->references('id')->on('student_infos')->onDelete('cascade');
            $table->foreign('school_year_id')->references('id')->on('school_years')->onDelete('cascade');
            $table->foreign('class_type_id')->references('id')->on('class_types')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('charge_students');
    }
}
