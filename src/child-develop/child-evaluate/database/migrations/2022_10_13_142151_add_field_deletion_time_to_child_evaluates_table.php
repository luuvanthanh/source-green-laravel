<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldDeletionTimeToChildEvaluatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ChildEvaluates', function (Blueprint $table) {
            $table->softDeletes('DeletedAt', 0)->nullable();
        });

        Schema::table('ChildEvaluateDetails', function (Blueprint $table) {
            $table->softDeletes('DeletedAt', 0)->nullable();
        });

        Schema::table('ChildEvaluateDetailChildrens', function (Blueprint $table) {
            $table->softDeletes('DeletedAt', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ChildEvaluates', function (Blueprint $table) {
            $table->dropSoftDeletes('DeletedAt');
        });

        Schema::table('ChildEvaluateDetails', function (Blueprint $table) {
            $table->dropSoftDeletes('DeletedAt');
        });

        Schema::table('ChildEvaluateDetailChildrens', function (Blueprint $table) {
            $table->dropSoftDeletes('DeletedAt');
        });
    }
}
