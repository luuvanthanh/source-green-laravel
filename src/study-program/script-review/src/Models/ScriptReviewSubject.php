<?php

namespace GGPHP\StudyProgram\ScriptReview\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\StudyProgram\Setting\Models\Subject;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScriptReviewSubject extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.ScriptReviewSubjects';

    protected $fillable = [
        'SubjectId', 'ScriptReviewId', 'IsCheck'
    ];

    public function scriptReviewSubjectDetail()
    {
        return $this->hasMany(ScriptReviewSubjectDetail::class, 'ScriptReviewSubjectId');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'SubjectId');
    }
}
