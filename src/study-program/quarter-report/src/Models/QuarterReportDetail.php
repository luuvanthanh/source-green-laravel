<?php

namespace GGPHP\StudyProgram\QuarterReport\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuarterReportDetail extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.QuarterReportDetails';

    protected $fillable = [
        'IsSubject', 'IsComment', 'ScriptReviewSubjectId', 'ScriptReviewCommentId', 'Content', 'QuarterReportId'
    ];

    public function quarterReportDetailSubject()
    {
        return $this->hasMany(QuarterReportDetailSubject::class, 'QuarterReportDetailId');
    }
}
