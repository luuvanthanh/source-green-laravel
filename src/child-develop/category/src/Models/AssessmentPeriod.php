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
        'Code', 'Name', 'SchoolYearId', 'StartDate', 'EndDate', 'BranchId', 'Use'
    ];

    const CODE = 'KN';

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'BranchId');
    }

    public function classes()
    {
        return $this->belongsToMany(Classes::class, 'AssessmentPeriodDetail', 'AssessmentPeriodId', 'ClassesId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }
}
