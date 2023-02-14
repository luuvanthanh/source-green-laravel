<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignToAttendancePhysicalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('physical.AttendancePhysicals', function (Blueprint $table) {
            $table->foreign('BranchId')->references('Id')->on('Branches');
            $table->foreign('ClassId')->references('Id')->on('origination.Classes');
            $table->foreign('PhysicalStudyProgramId')->references('Id')->on('physical.PhysicalStudyPrograms');
            $table->foreign('PhysicalStudyProgramSessionId')->references('Id')->on('physical.PhysicalStudyProgramSessions');
            $table->foreign('StudentId')->references('Id')->on('object.Students');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('physical.AttendancePhysicals', function (Blueprint $table) {
            $table->dropForeign('physical_attendancephysicals_branchid_foreign');
            $table->dropForeign('physical_attendancephysicals_classid_foreign');
            $table->dropForeign('physical_attendancephysicals_physicalstudyprogramid_foreign');
            $table->dropForeign('physical_attendancephysicals_physicalstudyprogramsessionid_fore');
            $table->dropForeign('physical_attendancephysicals_studentid_foreign');
        });
    }
}
