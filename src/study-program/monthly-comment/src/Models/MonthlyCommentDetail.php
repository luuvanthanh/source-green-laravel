<?php

namespace GGPHP\StudyProgram\MonthlyComment\Models;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewComment;
use GGPHP\StudyProgram\Setting\Models\SampleComment;
use GGPHP\Users\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyCommentDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.MonthlyCommentDetails';

    protected $fillable = [
        'ScriptReviewCommentId', 'Content', 'MonthlyCommentId'
    ];

    public function scriptReviewComment()
    {
        return $this->belongsTo(ScriptReviewComment::class, 'ScriptReviewCommentId');
    }
}
