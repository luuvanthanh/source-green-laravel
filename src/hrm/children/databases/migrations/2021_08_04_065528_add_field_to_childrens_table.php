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
        Schema::rename('Children', 'Childrens');

        Schema::table('Childrens', function (Blueprint $table) {
            $table->string('Relationship')->nullable();
            $table->boolean('IsDependentPerson')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::rename('Childrens', 'Children');

        Schema::table('Childrens', function (Blueprint $table) {
            $table->dropColumn('Relationship');
            $table->dropColumn('IsDependentPerson');
        });
    }
}
