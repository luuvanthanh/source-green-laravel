<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class ParamaterValue extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'parameter_values';

    protected $fillable = [
        'code', 'name', 'apply_date', 'value_default', 'note', 'type',
    ];

    /**
     * Define relations paramaterValueLog
     */
    public function paramaterValueLog()
    {
        return $this->hasMany(\GGPHP\Category\Models\ParamaterValueLog::class);
    }
}
