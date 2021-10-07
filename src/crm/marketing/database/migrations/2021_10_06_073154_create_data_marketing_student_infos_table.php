<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataMarketingStudentInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_marketing_student_infos', function (Blueprint $table) {
            $table->uuid('id')->index()->unique();
            $table->primary('id');
            $table->string('full_name');
            $table->date('birth_date')->nullable();
            $table->string('sex')->nullable();
            $table->float('month_age')->nullable();
            $table->string('relationship')->nullable();
            $table->uuid('data_marketing_id');
            $table->foreign('data_marketing_id')->references('id')->on('data_marketings')->onDelete('cascade');
            $table->string('file_image', 1000)->nullable();
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
        Schema::dropIfExists('data_marketing_student_infos');
    }
}
