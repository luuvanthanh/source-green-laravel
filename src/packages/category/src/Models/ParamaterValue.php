<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParamaterValue extends UuidModel
{
    public $incrementing = false;

    const CONTRACT = "CONTRACT";
    const COMMON = "COMMON";
    const

        DECLARE= "DECLARE";

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
