<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOtherDeclarationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('OtherDeclarationDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('EmployeeId');
            $table->foreign('EmployeeId')->references('Id')->on('Employees')->onDelete('SET NULL');
            $table->uuid('OtherDeclarationId');
            $table->foreign('OtherDeclarationId')->references('Id')->on('OtherDeclarations')->onDelete('cascade');
            $table->integer('Allowance');
            $table->integer('Bonus')->nullable();
            $table->integer('Retrieval')->nullable();
            $table->integer('PaymentOfSocialInsurance')->nullable();
            $table->integer('EmployeeSocialInsurance')->nullable();
            $table->integer('CompanySocialInsurance')->nullable();
            $table->integer('Charity')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('OtherDeclarationDetails');
    }
}
