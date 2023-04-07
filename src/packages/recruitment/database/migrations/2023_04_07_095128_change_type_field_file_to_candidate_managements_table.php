<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeFieldFileToCandidateManagementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('CandidateManagements', 'File'))
        {
            Schema::table('CandidateManagements', function (Blueprint $table) {
                $table->dropColumn('File');
            });
        }else {
            Schema::table('CandidateManagements', function (Blueprint $table) {
                $table->json('File');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
    }
}
