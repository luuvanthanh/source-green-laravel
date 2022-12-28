<?php

namespace GGPHP\StudyProgram\MonthlyComment\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewComment;

use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyCommentDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.MonthlyCommentDetails';

    protected $fillable = [
        'ScriptReviewCommentId', 'Content', 'MonthlyCommentId', 'IsSubject', 'IsComment', 'ScriptReviewSubjectId'
    ];

    public function scriptReviewComment()
    {
        return $this->belongsTo(ScriptReviewComment::class, 'ScriptReviewCommentId');
    }

    public function monthlyCommentDetailSubject()
    {
        return $this->hasMany(MonthlyCommentDetailSubject::class, 'MonthlyCommentDetailId');
    }
}
