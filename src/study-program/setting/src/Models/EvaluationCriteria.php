<?php

namespace GGPHP\StudyProgram\Setting\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class EvaluationCriteria extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.EvaluationCriterias';

    const CODE = 'TC';

    protected $fillable = [
        'Name', 'Code', 'Content'
    ];
}
