<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldPointFromToPointEvalutionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hrm."PointEvaluations"', function (Blueprint $table) {
            $table->string('PointFrom')->change();
            $table->string('PointTo')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hrm."PointEvaluations"', function (Blueprint $table) {
            //
        });
    }
}
