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
            $table->string('id', 36)->index()->unique();
            $table->primary('id');
            $table->string('WorkDeclarationId', 36);
            $table->foreign('WorkDeclarationId')->references('id')->on('WorkDeclarations')->onDelete('cascade');
            $table->string('ModelId', 36)->nullable();
            $table->string('ModelType')->nullable();
            $table->string('Reason')->nullable();
            $table->integer('WorkNumber')->nullable();
            $table->date('Month')->nullable();
            $table->json('Time');
            $table->string('ShiftId', 36)->nullable();
            $table->foreign('ShiftId')->references('id')->on('Shifts');
            $table->date('WorkDate')->nullable();
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
        Schema::dropIfExists('WorkDeclarationDetails');
    }
}
