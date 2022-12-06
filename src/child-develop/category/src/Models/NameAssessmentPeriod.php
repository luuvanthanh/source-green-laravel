<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class NameAssessmentPeriod extends UuidModel
{
    use ActivityLogTrait;
    protected $table = 'NameAssessmentPeriods';

    protected $fillable = [
        'Name', 'Use'
    ];
}
