<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditFieldCategoryRelationshipIdPotentialStudentInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('potential_student_infos', 'month_age', 'relationship')) {
            Schema::table('potential_student_infos', function (Blueprint $table) {
                $table->dropColumn('month_age');
                $table->dropColumn('relationship');
            });
        }

        if (!Schema::hasColumn('potential_student_infos', 'category_relationship_id')) {
            Schema::table('potential_student_infos', function (Blueprint $table) {
                $table->uuid('category_relationship_id')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('potential_student_infos', 'category_relationship_id')) {
            Schema::table('potential_student_infos', function (Blueprint $table) {
                $table->dropColumn('category_relationship_id');
            });
        }
    }
}
