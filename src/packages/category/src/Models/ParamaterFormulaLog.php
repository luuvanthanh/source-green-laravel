<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class ParamaterFormulaLog extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterFormulaLogs';

    protected $fillable = [
        'ParameterFormulaId', 'EditEmployee', 'EditDate', 'Name', 'ApplyDate', 'Recipe',
    ];
}
