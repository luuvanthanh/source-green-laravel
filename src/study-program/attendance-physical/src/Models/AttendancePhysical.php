<?php

namespace GGPHP\StudyProgram\AttendancePhysical\Models;

use GGPHP\Category\Models\Branch;
use GGPHP\Clover\Models\Classes;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Models\StudyProgram;
use GGPHP\Clover\Models\StudyProgramSession;
use GGPHP\Core\Models\UuidModel;

class AttendancePhysical extends UuidModel
{

    protected $table = 'physical.AttendancePhysicals';

    protected $fillable = [
        'BranchId', 'ClassId', 'PhysicalStudyProgramId', 'PhysicalStudyProgramSessionId', 'StudentId', 'DateHaveInClass'
    ];

    const STATUS = [
        'HAVE_IN_CLASS' => 1,
        'HAVE_OUT_CLASS' => 2
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'BranchId');
    }

    public function classes()
    {
        return $this->belongsTo(Classes::class, 'ClassId');
    }

    public function physicalStudyProgram()
    {
        return $this->belongsTo(StudyProgram::class, 'PhysicalStudyProgramId');
    }

    public function physicalStudyProgramSession()
    {
        return $this->belongsTo(StudyProgramSession::class, 'PhysicalStudyProgramSessionId');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'StudentId');
    }
}
