<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParamaterValueLog extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'parameter_value_logs';

    protected $fillable = [
        'parameter_value_id', 'edit_employee', 'edit_date', 'apply_date', 'value_default',
    ];

}
