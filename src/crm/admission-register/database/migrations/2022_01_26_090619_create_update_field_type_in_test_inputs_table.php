<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUpdateFieldTypeInTestInputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('test_inputs', function (Blueprint $table) {
            $table->integer('type')->change()->default(1);
            $table->renameColumn('teacher_comment', 'strength');
            $table->renameColumn('headmaster_comment', 'encourage');
            $table->uuid('class_type_id')->nullable();
        });

        Schema::table('test_input_detail_childrens', function (Blueprint $table) {
            $table->uuid('child_evalue_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('test_inputs', function (Blueprint $table) {
            $table->renameColumn('strength', 'teacher_comment');
            $table->renameColumn('encourage', 'headmaster_comment');
            $table->dropColumn('class_type_id');
        });

        Schema::table('test_input_detail_childrens', function (Blueprint $table) {
            $table->dropColumn('child_evalue_id');
        });
    }
}
