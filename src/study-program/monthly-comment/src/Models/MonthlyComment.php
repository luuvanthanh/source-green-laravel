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
        'CONFIRMED' => 3,
        'SENT' => 4
    ];

    protected $fillable = [
        'StudentId', 'Status', 'TeacherId', 'TeacherManagementId',
        'SchoolYearId', 'Month', 'ScriptReviewId'
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

    public function monthlyCommentDetail()
    {
        return $this->hasMany(MonthlyCommentDetail::class, 'MonthlyCommentId');
    }

    public function scriptReview()
    {
        return $this->belongsTo(ScriptReview::class, 'ScriptReviewId');
    }
}
