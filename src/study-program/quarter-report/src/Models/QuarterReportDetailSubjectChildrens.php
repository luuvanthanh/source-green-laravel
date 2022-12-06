<?php

namespace GGPHP\StudyProgram\QuarterReport\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuarterReportDetailSubjectChildrens extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.QuarterReportDetailSubjectChildrens';

    protected $fillable = [
        'ScriptReviewSubjectDetailChildrenId', 'EvaluationCriteriaId', 'QuarterReportDetailSubjectId'
    ];
}
