<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditColumnToOtherDeclarationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('OtherDeclarationDetails', function (Blueprint $table) {
            $table->json('Detail')->nullable();
            $table->dropColumn('Allowance');
            $table->dropColumn('Bonus');
            $table->dropColumn('Retrieval');
            $table->dropColumn('PaymentOfSocialInsurance');
            $table->dropColumn('EmployeeSocialInsurance');
            $table->dropColumn('CompanySocialInsurance');
            $table->dropColumn('Charity');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('OtherDeclarationDetails', function (Blueprint $table) {
            $table->dropColumn('Detail');
            $table->integer('Allowance')->nullable();
            $table->integer('Bonus')->nullable();
            $table->integer('Retrieval')->nullable();
            $table->integer('PaymentOfSocialInsurance')->nullable();
            $table->integer('EmployeeSocialInsurance')->nullable();
            $table->integer('CompanySocialInsurance')->nullable();
            $table->integer('Charity')->nullable();
        });
    }
}
