<?php

namespace GGPHP\StudyProgram\MonthlyComment\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubjectDetailChildren;
use GGPHP\StudyProgram\Setting\Models\EvaluationCriteria;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyCommentDetailSubjectChildren extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.MonthlyCommentDetailSubjectChildrens';

    protected $fillable = [
        'ScriptReviewSubjectDetailChildrenId', 'EvaluationCriteriaId', 'MonthlyCommentDetailSubjectId'
    ];

    public function scriptReviewSubjectDetailChildren()
    {
        return $this->belongsTo(ScriptReviewSubjectDetailChildren::class, 'ScriptReviewSubjectDetailChildrenId')->orderBy('CreationTime');;
    }

    public function evaluationCriteria()
    {
        return $this->belongsTo(EvaluationCriteria::class, 'EvaluationCriteriaId');
    }
}
