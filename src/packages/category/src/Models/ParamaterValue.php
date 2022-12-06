<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class ParamaterValue extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    const CONTRACT = 'CONTRACT';
    const COMMON = 'COMMON';
    const DECLARE= 'DECLARE';

    /**
     * Declare the table name
     */
    protected $table = 'ParameterValues';

    protected $fillable = [
        'Code', 'Name', 'ApplyDate', 'ValueDefault', 'Note', 'Type',
    ];

    /**
     * Define relations paramaterValueLog
     */
    public function paramaterValueLog()
    {
        return $this->hasMany(\GGPHP\Category\Models\ParamaterValueLog::class);
    }
}
