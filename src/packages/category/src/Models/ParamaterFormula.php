<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class ParamaterFormula extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterFormulas';

    protected $fillable = [
        'Code', 'Name', 'ApplyDate', 'Recipe',
    ];

    /**
     * Define relations paramaterFormulaLog
     */
    public function paramaterFormulaLog()
    {
        return $this->hasMany(\GGPHP\Category\Models\ParamaterFormulaLog::class);
    }
}
