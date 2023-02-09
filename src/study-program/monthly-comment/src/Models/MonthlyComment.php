<?php

namespace GGPHP\StudyProgram\MonthlyComment\Models;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use GGPHP\StudyProgram\Setting\Models\SampleComment;
use GGPHP\Users\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyComment extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.MonthlyComments';

    const STATUS = [
        'NOT_REVIEW' => 1,
        'REVIEWED' => 2,
        'NOT_YET_CONFIRM' => 3,
        'CONFIRMED' => 4,
        'NOT_YET_SENT' => 5,
        'SENT' => 6
    ];

    const TYPE = [
        'DUPLICATE' => 2,
    ];

    protected $fillable = [
        'StudentId', 'ScriptReviewId', 'Status', 'TeacherId', 'TeacherManagementId', 'SchoolYearId',
        'ReportTime', 'ConfirmationTime', 'Type', 'MonthlyCommentId', 'Month', 'SentTime', 'TeacherSentId'
    ];

    protected $dateTimeFields = [
        'ReportTime', 'ConfirmationTime', 'SentTime'
    ];

    public function sampleComment()
    {
        return $this->belongsTo(SampleComment::class, 'SampleCommentId');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'TeacherId');
    }

    public function teacherManagement()
    {
        return $this->belongsTo(User::class, 'TeacherManagementId');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'StudentId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }

    public function monthlyCommentDetail()
    {
        return $this->hasMany(MonthlyCommentDetail::class, 'MonthlyCommentId')->orderBy('CreationTime');
    }

    public function scriptReview()
    {
        return $this->belongsTo(ScriptReview::class, 'ScriptReviewId');
    }

    public function teacherSent()
    {
        return $this->belongsTo(User::class, 'TeacherSentId');
    }
}
