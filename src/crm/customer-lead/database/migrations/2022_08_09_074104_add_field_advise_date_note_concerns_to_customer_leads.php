<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldAdviseDateNoteConcernsToCustomerLeads extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customer_leads', function (Blueprint $table) {
            $table->date('advise_date')->nullable();
            $table->string('note')->nullable();
            $table->string('concerns')->nullable();
            $table->boolean('data_excel')->default(false);
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
            $table->dropColumn('advise_date', 'note', 'concerns', 'data_excel');
        });
    }
}
