<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdmissionRegistersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admission_registers', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->primary('id');
            $table->uuid('student_info_id');
            $table->string('address')->nullable();
            $table->date('date_register');
            $table->string('parent_wish')->nullable();
            $table->string('children_note')->nullable();
            $table->uuid('branch_id')->nullable();
            $table->uuid('school_year_id')->nullable();
            $table->uuid('status_admission_register_id')->nullable();
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
        Schema::dropIfExists('admission_registers');
    }
}
