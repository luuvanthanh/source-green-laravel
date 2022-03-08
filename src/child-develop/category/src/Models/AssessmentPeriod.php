<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\Category\Models\Branch;
use GGPHP\Clover\Models\Classes;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class AssessmentPeriod extends UuidModel
{
    protected $table = 'AssessmentPeriods';

    protected $fillable = [
        'Code', 'Name', 'SchoolYearId', 'StartDate', 'EndDate', 'Use', 'NameAssessmentPeriodId', 'Introduction', 'Periodic'
    ];

    const CODE = 'KN';

    public function branch()
    {
        return $this->belongsToMany(Branch::class, 'AssessmentPeriodBranchs', 'AssessmentPeriodId', 'BranchId');
    }

    public function classes()
    {
        return $this->belongsToMany(Classes::class, 'AssessmentPeriodDetail', 'AssessmentPeriodId', 'ClassesId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }

    public function nameAssessmentPeriod()
    {
        return $this->belongsTo(NameAssessmentPeriod::class, 'NameAssessmentPeriodId');
    }
}
