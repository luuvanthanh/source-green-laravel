<?php

namespace GGPHP\StudyProgram\ScriptReview\Models;

use GGPHP\Category\Models\Branch;
use GGPHP\Clover\Models\Classes;
use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScriptReview extends UuidModel
{
    use SoftDeletes;

    const TYPE = [
        'MONTHLY_COMMENT' => 1,
        'QUARTER_REPORT' => 2
    ];

    protected $table = 'study-program.ScriptReviews';

    protected $fillable = [
        'Type', 'NameAssessmentPeriodId', 'IsCheckSampleComment', 'IsCheckSubject'
    ];

    public function branch()
    {
        return $this->belongsToMany(Branch::class, 'study-program.ScriptReviewBranches', 'ScriptReviewId', 'BranchId');
    }

    public function classes()
    {
        return $this->belongsToMany(Classes::class, 'study-program.ScriptReviewClasses', 'ScriptReviewId', 'ClassId');
    }

    public function scriptReviewSubject()
    {
        return $this->hasMany(ScriptReviewSubject::class, 'ScriptReviewId');
    }

    public function scriptReviewComment()
    {
        return $this->hasMany(ScriptReviewComment::class, 'ScriptReviewId');
    }
}
