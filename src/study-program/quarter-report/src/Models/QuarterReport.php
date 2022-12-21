<?php

namespace GGPHP\StudyProgram\QuarterReport\Models;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use GGPHP\Users\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuarterReport extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.QuarterReports';

    const STATUS = [
        'NOT_REVIEW' => 1,
        'REVIEWED' => 2,
        'NOT_YET_CONFIRM' => 3,
        'CONFIRMED' => 4,
        'SENT' => 5
    ];

    const TYPE = [
        'DUPLICATE' => 1,
    ];

    protected $fillable = [
        'StudentId', 'ScriptReviewId', 'Status', 'TeacherId', 'TeacherManagementId', 'SchoolYearId',
        'ReportTime', 'ConfirmationTime', 'Type'
    ];

    public function quarterReportDetail()
    {
        return $this->hasMany(QuarterReportDetail::class, 'QuarterReportId');
    }

    public function scriptReview()
    {
        return $this->belongsTo(ScriptReview::class, 'ScriptReviewId');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'TeacherId');
    }

    public function teacherManagement()
    {
        return $this->belongsTo(User::class, 'TeacherId');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'StudentId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }
}
