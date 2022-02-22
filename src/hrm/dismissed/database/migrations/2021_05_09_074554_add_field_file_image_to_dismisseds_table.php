<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldFileImageToDismissedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('Dismisseds', function (Blueprint $table) {
            $table->string('FileImage', 1000)->nullable();
        });

        Schema::table('"Dismisseds"', function (Blueprint $table) {
            $table->string('"Reason"')->nullable()->change();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('Dismisseds', function (Blueprint $table) {
            $table->dropColumn('FileImage');
        });
    }
}
