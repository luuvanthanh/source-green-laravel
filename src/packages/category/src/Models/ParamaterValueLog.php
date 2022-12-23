<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class ParamaterValueLog extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterValueLogs';

    protected $fillable = [
        'ParameterValueId', 'EditEmployee', 'EditDate', 'ApplyDate', 'ValueDefault',
    ];
}
