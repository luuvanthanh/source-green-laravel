<?php

namespace GGPHP\StudyProgram\QuarterReport\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubjectDetailChildren;
use GGPHP\StudyProgram\Setting\Models\EvaluationCriteria;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuarterReportDetailSubjectChildren extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.QuarterReportDetailSubjectChildrens';

    protected $fillable = [
        'ScriptReviewSubjectDetailChildrenId', 'EvaluationCriteriaId', 'QuarterReportDetailSubjectId'
    ];

    public function scriptReviewSubjectDetailChildren()
    {
        return $this->belongsTo(ScriptReviewSubjectDetailChildren::class, 'ScriptReviewSubjectDetailChildrenId');
    }

    public function evaluationCriteria()
    {
        return $this->belongsTo(EvaluationCriteria::class, 'EvaluationCriteriaId');
    }
}
