<?php

namespace GGPHP\Crm\Clover\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

class CriteriaStandardCriteria extends UuidModel
{
    protected $table = 'criteria.CriteriaStandards';

    protected $fillable = [
        'MonthNumber',
        'Value',
        'CreatorId',
        'Type'
    ];
}
