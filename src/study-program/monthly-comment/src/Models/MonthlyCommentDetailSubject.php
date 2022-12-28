<?php

namespace GGPHP\StudyProgram\MonthlyComment\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubjectDetail;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyCommentDetailSubject extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.MonthlyCommentDetailSubjects';

    protected $fillable = [
        'ScriptReviewSubjectDetailId', 'MonthlyCommentDetailId'
    ];

    public function monthlyCommentDetailSubjectChildren()
    {
        return $this->hasMany(MonthlyCommentDetailSubjectChildren::class, 'MonthlyCommentDetailSubjectId');
    }

    public function scriptReviewSubjectDetail()
    {
        return $this->belongsTo(ScriptReviewSubjectDetail::class, 'ScriptReviewSubjectDetailId');
    }
}
