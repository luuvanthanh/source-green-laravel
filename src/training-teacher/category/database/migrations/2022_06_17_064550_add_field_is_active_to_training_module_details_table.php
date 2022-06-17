<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldIsActiveToTrainingModuleDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluate_teacher.TrainingModuleDetails', function (Blueprint $table) {
            $table->boolean('IsActive')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluate_teacher.TrainingModuleDetails', function (Blueprint $table) {
            $table->dropColumn('IsActive');
        });
    }
}
