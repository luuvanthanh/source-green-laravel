<?php

namespace GGPHP\StudyProgram\QuarterReport\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuarterReportDetailSubject extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.QuarterReportDetailSubjects';

    protected $fillable = [
        'ScriptReviewSubjectDetailId', 'QuarterReportDetailId'
    ];

    public function quarterReportDetailSubjectChildren()
    {
        return $this->hasMany(QuarterReportDetailSubjectChildrens::class, 'QuarterReportDetailSubjectId');
    }
}
