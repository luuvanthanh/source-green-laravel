<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkDeclarationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('WorkDeclarationDetails', function (Blueprint $table) {
            $table->uuid('Id')->index()->unique();
            $table->primary('Id');
            $table->uuid('WorkDeclarationId');
            $table->foreign('WorkDeclarationId')->references('Id')->on('WorkDeclarations')->onDelete('cascade');
            $table->uuid('ModelId')->nullable();
            $table->string('ModelType')->nullable();
            $table->string('Reason')->nullable();
            $table->integer('WorkNumber')->nullable();
            $table->date('Month')->nullable();
            $table->json('Time');
            $table->uuid('ShiftId')->nullable();
            $table->foreign('ShiftId')->references('Id')->on('Shifts');
            $table->date('WorkDate')->nullable();
            $table->timestamp('CreationTime', 0)->nullable();
            $table->timestamp('LastModificationTime', 0)->nullable();
            $table->softDeletes('DeletionTime', 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('WorkDeclarationDetails');
    }
}
