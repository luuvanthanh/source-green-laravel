<?php

namespace GGPHP\ChildDevelop\TestSemester\Models;

use GGPHP\ChildDevelop\Category\Models\AssessmentPeriod;
use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;

class TestSemester extends UuidModel
{
    protected $table = 'TestSemesters';

    protected $fillable = [
        'AssessmentPeriodId', 'StudentId', 'Status', 'Type'
    ];

    const STATUS = [
        'UNTESTING' => 0,
        'TESTING' => 1,
        'FINISH' => 2,
        'CANCEL' => 3,
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
}
