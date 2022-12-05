<?php

namespace GGPHP\StudyProgram\ScriptReview\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScriptReviewCommentDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.ScriptReviewCommentDetails';

    protected $fillable = [
        'SampleCommentDetailId', 'ScriptReviewCommentId', 'IsCheck'
    ];
}
