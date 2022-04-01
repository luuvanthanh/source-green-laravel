<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldNewStatusToAdmissionRegistersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admission_registers', function (Blueprint $table) {
            $table->boolean('disable_status')->default(false);
            $table->integer('register_status')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('admission_registers', function (Blueprint $table) {
            $table->dropColumn(['disable_status', 'register_status']);
        });
    }
}
