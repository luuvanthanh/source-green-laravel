<?php

namespace GGPHP\StudyProgram\ScriptReview\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScriptReviewSubjectDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.ScriptReviewSubjectDetails';

    protected $fillable = [
        'SubjectSectionId', 'ScriptReviewSubjectId', 'IsCheck'
    ];

    public function scriptReviewSubjectDetailChildren()
    {
        return $this->hasMany(ScriptReviewSubjectDetailChildren::class, 'ScriptReviewSubjectDetailId');
    }
}
