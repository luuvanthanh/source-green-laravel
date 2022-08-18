<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuthorizedPersonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('AuthorizedPersons', function (Blueprint $table) {
            $table->uuid('Id')->index()->primary();
            $table->uuid('EmployeeId')->index();
            $table->date('DateApply');
            $table->boolean('IsEffect')->default(false);
            $table->string('PowerOfAttorney')->nullable();
            $table->timestamp('CreationTime');
            $table->timestamp('LastModificationTime');
            $table->foreign('EmployeeId')->references('Id')->on('Employees');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('AuthorizedPersons');
    }
}
