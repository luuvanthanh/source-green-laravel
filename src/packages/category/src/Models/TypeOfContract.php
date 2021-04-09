<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TypeOfContract extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'type_of_contracts';

    protected $fillable = [
        'code', 'type', 'name', 'year', 'month',
    ];

}
