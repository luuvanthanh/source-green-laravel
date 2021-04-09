<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParamaterFormula extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'parameter_formulas';

    protected $fillable = [
        'code', 'name', 'apply_date', 'recipe',
    ];

    /**
     * Define relations paramaterFormulaLog
     */
    public function paramaterFormulaLog()
    {
        return $this->hasMany(\GGPHP\Category\Models\ParamaterFormulaLog::class);
    }
}
