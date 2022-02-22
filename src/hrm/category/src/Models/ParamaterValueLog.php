<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParamaterValueLog extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterValueLogs';

    protected $fillable = [
        'ParameterValueId', 'EditEmployee', 'EditDate', 'ApplyDate', 'ValueDefault',
    ];
}
