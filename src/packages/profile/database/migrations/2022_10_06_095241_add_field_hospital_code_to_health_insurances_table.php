<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldHospitalCodeToHealthInsurancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('HealthInsurances', function (Blueprint $table) {
            $table->string('HospitalCode')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('HealthInsurances', function (Blueprint $table) {
            $table->dropColumn('HospitalCode');
        });
    }
}
