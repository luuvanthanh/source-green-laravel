<?php

namespace GGPHP\ChildDevelop\Category\Models;

use GGPHP\Core\Models\UuidModel;

class NameAssessmentPeriod extends UuidModel
{
    protected $table = 'NameAssessmentPeriods';

    protected $fillable = [
        'Name', 'Use'
    ];
}
