<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class ParameterTax extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ParameterTaxs';

    protected $fillable = [
        'Code', 'Name', 'From', 'To', 'Fax', 'ApplyDate',
    ];

    /**
     * Define relations paramaterFormulaLog
     */
    public function paramaterFormulaLog()
    {
        return $this->hasMany(\GGPHP\Category\Models\ParameterTaxLog::class);
    }
}
