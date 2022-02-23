<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameBranchIdColumnCustomerLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customer_leads', function (Blueprint $table) {
            $table->renameColumn('facility_id', 'branch_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customer_leads', function (Blueprint $table) {
            $table->renameColumn('branch_id', 'facility_id');
        });
    }
}
