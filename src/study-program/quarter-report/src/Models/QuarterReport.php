<?php

namespace GGPHP\StudyProgram\QuarterReport\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuarterReport extends UuidModel
{
    use SoftDeletes;

    protected $table = 'study-program.QuarterReports';

    const STATUS = [
        'NOT_REVIEW' => 1,
        'REVIEWED' => 2,
        'CONFIRMED' => 3,
        'SENT' => 4
    ];

    protected $fillable = [
        'StudentId', 'ScriptReviewId', 'Status'
    ];

    public function quarterReportDetail()
    {
        return $this->hasMany(QuarterReportDetail::class, 'QuarterReportId');
    }
}
