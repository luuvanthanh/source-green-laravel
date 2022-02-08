<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldApprovalStatusToTestInputsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admission_registers', function (Blueprint $table) {
            $table->dropColumn('status_admission');
        });

        Schema::table('test_inputs', function (Blueprint $table) {
            $table->integer('approval_status')->default(0);
            $table->integer('type')->default(1)->change();
        });

        Schema::table('test_input_detail_childrens', function (Blueprint $table) {
            $table->renameColumn('child_evalue_id', 'child_evalua_id');
            $table->renameColumn('child_evaluate_detail_childrent_id', 'child_evaluate_detail_children_id');
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
            $table->dropColumn('approval_status');
        });

        Schema::table('test_input_detail_childrens', function (Blueprint $table) {
            $table->renameColumn('child_evalua_id', 'child_evalue_id');
            $table->renameColumn('child_evaluate_detail_children_id', 'child_evaluate_detail_childrent_id');
        });

        Schema::table('admission_registers', function (Blueprint $table) {
            $table->string('status_admission')->nullable();
        });
    }
}
