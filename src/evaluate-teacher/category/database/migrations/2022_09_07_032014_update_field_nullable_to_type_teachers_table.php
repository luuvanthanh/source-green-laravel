<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldNullableToTypeTeachersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('evaluate_teacher."TypeTeachers"', function (Blueprint $table) {
            $table->uuid('TypeOfContractId')->nullable()->change();
            $table->uuid('RatingLevelFrom')->nullable()->change();
        });

        Schema::table('evaluate_teacher.TypeTeachers', function (Blueprint $table) {
            $table->decimal('BasicSalary', 12, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('evaluate_teacher.TypeTeachers', function (Blueprint $table) {
            $table->dropColumn('BasicSalary');
        });
    }
}
