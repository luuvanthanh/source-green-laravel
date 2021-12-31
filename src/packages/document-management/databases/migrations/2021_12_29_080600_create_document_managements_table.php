<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentManagementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DocumentManagements', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->string('TypeOfDocument');
            $table->string('Topic');
            $table->uuid('SentDivisionId');
            $table->uuid('EmployeeId');
            $table->uuid('BranchId')->nullable();
            $table->uuid('ReceiveDivisionId')->nullable();
            $table->string('Title');
            $table->mediumText('Content');
            $table->string('FileDocument', 1000)->nullable();
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
        Schema::dropIfExists('DocumentManagements');
    }
}
