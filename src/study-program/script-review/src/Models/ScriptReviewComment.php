<?php

namespace GGPHP\StudyProgram\ScriptReview\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\StudyProgram\Setting\Models\SampleComment;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScriptReviewComment extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.ScriptReviewComments';

    protected $fillable = [
        'SampleCommentId', 'ScriptReviewId', 'IsCheck'
    ];

    public function scriptReviewCommentDetail()
    {
        return $this->hasMany(ScriptReviewCommentDetail::class, 'ScriptReviewCommentId');
    }

    public function sampleComment()
    {
        return $this->belongsTo(SampleComment::class, 'SampleCommentId');
    }
}
