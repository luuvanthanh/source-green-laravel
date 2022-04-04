<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFiledFileNameToDocumentManagementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('DocumentManagements', function (Blueprint $table) {
            $table->string('FileName')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('DocumentManagements', function (Blueprint $table) {
            $table->dropColumn('FileName');
        });
    }
}
