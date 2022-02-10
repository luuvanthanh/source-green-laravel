<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldClassTypeCrmIdTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fee.ClassTypes', function (Blueprint $table) {
            $table->uuid('ClassTypeCrmId')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fee.ClassTypes', function (Blueprint $table) {
            $table->dropColumn('ClassTypeCrmId');
        });
    }
}
