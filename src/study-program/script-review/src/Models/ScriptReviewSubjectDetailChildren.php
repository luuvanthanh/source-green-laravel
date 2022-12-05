<?php

namespace GGPHP\StudyProgram\ScriptReview\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScriptReviewSubjectDetailChildren extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.ScriptReviewSubjectDetailChildrens';

    protected $fillable = [
        'SubjectSectionDetailId', 'ScriptReviewSubjectDetailId', 'IsCheck'
    ];
}
