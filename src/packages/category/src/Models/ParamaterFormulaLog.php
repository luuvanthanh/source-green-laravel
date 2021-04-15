<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParamaterFormulaLog extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'parameter_formula_logs';

    protected $fillable = [
        'parameter_formula_id', 'edit_employee', 'edit_date', 'name', 'apply_date', 'recipe',
    ];

}
