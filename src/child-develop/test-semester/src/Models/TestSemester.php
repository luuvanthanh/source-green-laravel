<?php

namespace GGPHP\ChildDevelop\TestSemester\Models;

use GGPHP\ChildDevelop\Category\Models\AssessmentPeriod;
use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ClassType;

class TestSemester extends UuidModel
{
    protected $table = 'TestSemesters';

    protected $fillable = [
        'AssessmentPeriodId', 'StudentId', 'Status', 'Type', 'ApprovalStatus', 'Strength', 'Encourage', 'ClassTypeId', 'TimeAgeTestSemester'
    ];

    const STATUS = [
        'UNTESTING' => 0,
        'TESTING' => 1,
        'FINISH' => 2,
        'CANCEL' => 3,
    ];

    const APPROVAL_STATUS = [
        'UNSENT' => 0,
        'UNQUALIFIED' => 1,
        'APPROVAD' => 2,
    ];

    const TYPE = [
        'TEST_SEMESTER' => 0,
        'TEST_INPUT' => 1
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'StudentId');
    }

    public function assessmentPeriod()
    {
        return $this->belongsTo(AssessmentPeriod::class, 'AssessmentPeriodId');
    }

    public function testSemesterDetail()
    {
        return $this->hasMany(TestSemesterDetail::class, 'TestSemesterId')->orderBy('CreationTime', 'DESC');
    }

    public function classType()
    {
        return $this->belongsTo(ClassType::class, 'ClassTypeId');
    }
}
