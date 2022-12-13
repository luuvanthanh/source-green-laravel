<?php

namespace GGPHP\StudyProgram\QuarterReport\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewComment;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubject;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuarterReportDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.QuarterReportDetails';

    protected $fillable = [
        'IsSubject', 'IsComment', 'ScriptReviewSubjectId', 'ScriptReviewCommentId', 'Content', 'QuarterReportId'
    ];

    public function quarterReportDetailSubject()
    {
        return $this->hasMany(QuarterReportDetailSubject::class, 'QuarterReportDetailId');
    }

    public function scriptReviewSubject()
    {
        return $this->belongsTo(ScriptReviewSubject::class, 'ScriptReviewSubjectId');
    }

    public function scriptReviewComment()
    {
        return $this->belongsTo(ScriptReviewComment::class, 'ScriptReviewCommentId');
    }
}
