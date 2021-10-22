<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldToChildrensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Childrens', function (Blueprint $table) {
            $table->string('TaxCode')->nullable();
            $table->date('DedectionTimeFrom')->nullable();
            $table->date('DedectionTimeTo')->nullable();
            $table->string('FileImage', 1000)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Childrens', function (Blueprint $table) {
            $table->dropColumn('TaxCode');
            $table->dropColumn('DedectionTimeFrom');
            $table->dropColumn('DedectionTimeTo');
            $table->dropColumn('FileImage');
        });
    }
}
