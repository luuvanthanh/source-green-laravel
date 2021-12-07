<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditFieldInConfigMedicalDeclaresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('config_medical_declares', function (Blueprint $table) {
            $table->boolean('use')->default('false');
            $table->boolean('use_yes_or_no')->default('false');
            $table->boolean('use_input')->default('false');
            $table->string('type')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('config_medical_declares', function (Blueprint $table) {
            $table->dropColumn('use');
            $table->dropColumn('use_yes_or_no');
            $table->dropColumn('use_input');
        });
    }
}
