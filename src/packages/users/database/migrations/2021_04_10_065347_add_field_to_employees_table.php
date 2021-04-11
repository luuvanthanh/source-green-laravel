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
            $table->date('place_of_birth')->nullable();
            $table->date('email')->nullable();
            $table->date('phone_number')->nullable();
            $table->string('code');
            $table->string('permanent_address')->nullable();
            $table->string('nationality')->nullable();
            $table->string('nation')->nullable();
            $table->string('id_card')->nullable();
            $table->string('date_of_issue_id_card')->nullable();
            $table->string('place_of_issue_id_card')->nullable();
            $table->string('religion')->nullable();
            $table->string('gender')->nullable();
            $table->string('tax_code')->nullable();
            $table->string('degree_id', 36)->nullable();
            $table->foreign('degree_id')->references('id')->on('degrees');
            $table->string('training_major_id', 36)->nullable();
            $table->foreign('training_major_id')->references('id')->on('training_majors');
            $table->string('training_school_id', 36)->nullable();
            $table->foreign('training_school_id')->references('id')->on('training_schools');
            $table->date('date_off')->nullable();
            $table->date('address')->nullable();
            $table->string('educational_level_id', 36)->nullable();
            $table->foreign('educational_level_id')->references('id')->on('educational_levels');
            $table->date('work_date')->nullable();
            $table->string('health_insurance_book_number')->nullable();
            $table->string('hospital_adress')->nullable();
            $table->string('social_insurance_book_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_number_of_account')->nullable();
            $table->string('note')->nullable();
            $table->boolean('maternity_leave')->default(false);
            $table->date('maternity_leave_from')->nullable();
            $table->date('maternity_leave_to')->nullable();
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
            $table->dropColumn('place_of_birth');
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
            $table->dropColumn('email');
            $table->dropColumn('phone_number');
            $table->dropColumn('permanent_address');
            $table->dropColumn('nationality');
            $table->dropColumn('nation');
            $table->dropColumn('id_card');
            $table->dropColumn('date_of_issue_id_card');
            $table->dropColumn('place_of_issue_id_card');
            $table->dropColumn('religion');
            $table->dropColumn('address');
            $table->dropForeign('employees_educational_level_id_foreign');
            $table->dropColumn('educational_level_id');
            $table->dropColumn('work_date');
            $table->dropColumn('health_insurance_book_number');
            $table->dropColumn('hospital_adress');
            $table->dropColumn('social_insurance_book_number');
            $table->dropColumn('bank_name');
            $table->dropColumn('bank_number_of_account');
            $table->dropColumn('note');
            $table->dropColumn('maternity_leave');
            $table->dropColumn('maternity_leave_from');
            $table->dropColumn('maternity_leave_to');
        });
    }
}
