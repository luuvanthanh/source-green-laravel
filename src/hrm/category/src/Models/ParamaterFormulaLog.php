<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParamaterFormulaLog extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterFormulaLogs';

    protected $fillable = [
        'ParameterFormulaId', 'EditEmployee', 'EditDate', 'Name', 'ApplyDate', 'Recipe',
    ];
}
