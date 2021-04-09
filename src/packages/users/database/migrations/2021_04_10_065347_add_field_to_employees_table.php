<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('code');
            $table->string('tax_code');
            $table->string('degree_id', 36);
            $table->foreign('degree_id')->references('id')->on('degrees');
            $table->string('training_major_id', 36);
            $table->foreign('training_major_id')->references('id')->on('training_majors');
            $table->string('training_school_id', 36);
            $table->foreign('training_school_id')->references('id')->on('training_schools');
            $table->date('date_off')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('date_of_birth');
            $table->dropColumn('gender');
            $table->dropColumn('code');
            $table->dropColumn('tax_code');
            $table->dropForeign('employees_degree_id_foreign');
            $table->dropForeign('employees_training_major_id_foreign');
            $table->dropForeign('employees_training_school_id_foreign');
            $table->dropColumn('degree_id');
            $table->dropColumn('training_major_id');
            $table->dropColumn('training_school_id');
            $table->dropColumn('date_off');
        });
    }
}
