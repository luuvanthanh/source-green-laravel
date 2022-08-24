<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToGradeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"GradeDetails"', function (Blueprint $table) {
            $table->renameColumn('"Description"', '"Define"');
        });

        Schema::table('GradeDetails', function (Blueprint $table) {
            $table->string('SpecificExpression', 4000)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"GradeDetails"', function (Blueprint $table) {
            $table->renameColumn('"Define"', '"Description"');
        });

        Schema::table('GradeDetails', function (Blueprint $table) {
            $table->dropColumn('SpecificExpression');
        });
    }
}
