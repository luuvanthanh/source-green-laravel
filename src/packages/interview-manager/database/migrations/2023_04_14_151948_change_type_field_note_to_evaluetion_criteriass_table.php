<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldNoteToEvaluetionCriteriassTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('"EvaluationCriteriass"', function (Blueprint $table) {
            $table->text('Note')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('"EvaluationCriteriass"', function (Blueprint $table) {
            $table->string('Note')->change();
        });
    }
}
